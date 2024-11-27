# External Imports
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from decimal import Decimal
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
import requests
from datetime import datetime
from sqlalchemy import text

# Local Imports
from common_utils import valid_dob, build_patient_resource
from db import db, check_connection
from models import Account, UserBgIns, UserAchv, AchvChart


# Create a custom JSON encoder
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

# Flask Stuff
app = Flask(__name__)
CORS(app)
api = Api(app)

# Configure Flask-RESTful to use the custom encoder
@api.representation('application/json')
def output_json(data, code, headers=None):
    resp = app.make_response(json.dumps(data, cls=DecimalEncoder))
    resp.headers.extend(headers or {})
    resp.headers['Content-Type'] = 'application/json'
    return resp

# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)
environment = os.getenv('ENVIRONMENT')  # PROD = Should be set via Render and Connected to the MySQL DB
                                        # TEST = Local Development and Test, using in-memory SQL-Lite DB.
                                        # DEV (UNUSED) = Prod-like but another 'test' MySQL database could be used here?

# Global Default Vars
fhir_url = "http://hapi.fhir.org/baseR4/Patient"
db_initialized = False

###########################
#      Database Init      #
###########################
def init_db(env):
    if 'SQLALCHEMY_DATABASE_URI' not in app.config: # If we don't already have a db for this sessions context
        print("INFO: Initializing DB")

        # Production 'MySQL' Database
        if env == 'PROD':
            SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{os.getenv('MYSQL_DATABASE_USER')}:{os.getenv('MYSQL_DATABASE_PASSWORD')}@"
            f"{os.getenv('MYSQL_DATABASE_HOST')}:3306/{os.getenv('MYSQL_DATABASE_DB')}")
        # Test - Dynamic 'in-memory sqlite' database
        elif env == 'TEST':
            SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use an in-memory SQLite database
        # UNSUPPORTED DATABASE!
        else:
            print("ERROR: ENVIRONMENT " + env + "is unsupported! Currently only supporting \'PROD\' or \'TEST\'.")
            print("ERROR: Check your .env file and ensure that you've specified the correct environment and try again. ")
            exit(1)

        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False    # Not using the Flask-SQLAlchemy's event system, set explicitly to false in order to get rid of warning
        db.init_app(app)                                        # Bind the app to the db instance
        is_connected, message = check_connection(app)           # Verify the database connection
        print(message)                                          # Printing to the STDOUT is fine for now

    global db_initialized
    db_initialized = True


#--- End DB init ---#

# Home Route
# Don't touch this, lets leave as is until we have reason not to.
@app.route('/')
def home_endpoint():
    return 'CS6440 Team 62 Group Project! Fall 2024.'

# Endpoint to validate the user login
# can be tested with curl - curl -X POST http://127.0.0.1:5000/validateUserLogin \
# -H "Content-Type: application/json" \
# -d '{"username": "user1", "password": "password123"}'
class ValidateUserLogin(Resource):
    def post(self):

        # Extract Data from Request
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        # Validate input
        if not username or not password:
            return make_response({"message": "Username and password are required"}, 400)

        # Query the database for the user using SQLAlchemy ORM
        user = Account.query.filter_by(username=username).first()

        # If there is a user defined and the passwords match
        if user and check_password_hash(user.password, password):
            return {
                "id": user.id,
                "message": "Login successful",
                "username": user.username,
                "first_name": user.first_name
            }, 200
        else:
            return make_response({"message": "Invalid username or password"},401)

class CreateUserAccount(Resource):
    def post(self):

        """
        :Description:
            Endpoint does 3 things:
                1. Creates a new user account and saves the account info to the 'accounts' table.
                2. Queries the HAPI FHIR test server with the 'Patient' Resource for a response and saves it to the accounts table.
                2. Creates Default User Achievement record linked to account and saves it in the user achievement
        :Returns:
            Flask Response Object with a Message as data and status_code
        """

        # Extract Data from Request
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        firstname = data.get("firstname")
        middlename = data.get("middlename", '') # Optional, This will be an empty string if 'middlename' is not present
        lastname = data.get("lastname")
        dob = data.get('dob') # Date of Birth, should be passed in format its stored in, e.g., YYYY-MM-DD

        # Validate input
        # This is the last line of defense, frontend should ensure users are not submitting request -
        # without all required fields present.
        if not username or not password or not firstname or not lastname or not dob:
            invalid_input_message = ("Not all required fields are present. "
                       "Ensure username, password, firstname, lastname, and dob are passed as part of the request.")
            return make_response({"message": invalid_input_message }, 400)

        # Validate username - check if it already exists
        # Query the database for the user using SQLAlchemy ORM
        user = Account.query.filter_by(username=username).first()
        if user:
            already_existing_user_message = "Username already exists"
            return make_response({"message": already_existing_user_message}, 409) # Conflict - username already exists

        # Validate dob
        is_valid_dob, formatted_dob = valid_dob(dob)
        if not is_valid_dob:
            not_valid_dob_message = "Not a valid dob, ensure its formatted as YYYY-MM-DD"
            return make_response({"message": not_valid_dob_message}, 400)

        # Create Patient in HAPI FHIR Test Server - Passing Patient Resource
        # NOTE - This doesn't fail if the user already exists
        patient_data = build_patient_resource(firstname, lastname, dob)
        response = requests.post(fhir_url, json=patient_data, headers={'Content-Type': 'application/fhir+json'})

        # Check if the POST request was successful
        if response.status_code == 201:
            print("INFO: Patient created successfully in FHIR Server.")
        else:
            print("ERROR: Response Status Code - {0} - Unable to create account in HAPI FHIR Server!"
                  .format(response.status_code))
            return make_response({"message": "Error communicating with FHIR server. Please try again."}, 500)  # Internal Server Error

        # At this point, everything is gucci - lets create that user!
        hashed_password = generate_password_hash(password)
        new_user = Account(
            username=username,
            password=hashed_password,
            first_name=firstname,
            mid_name=middlename,
            last_name=lastname,
            dob=formatted_dob,
            hapi_fhir_response=response.text
        )

        # Add the new user to the session and commit
        db.session.add(new_user)
        try:
            db.session.commit()
            print("INFO: User Created Successfully!\n \tusername: {0},\n \tuser_id: {1}".format(new_user.username, new_user.id))
        except IntegrityError:
            db.session.rollback()
            return make_response({"message": "Error creating user. Please try again."}, 500)  # Internal Server Error

        # Add Default User Achievement - Now that the User Account is created and ID is initialized
        default_rank = "Bronze"
        default_num_points = 0
        default_achievement = UserAchv(
            account_id = new_user.id,
            current_rank = default_rank,
            current_points = default_num_points
        )

        # Add the default user achievement record to the session and commit
        db.session.add(default_achievement)
        try:
            db.session.commit()

            # Create the response
            response_data = {
                "ID": new_user.id,
                "message": "User created successfully"
            }

            # Use make_response to create the Response object with custom status code
            response = make_response(jsonify(response_data), 201)  # 201 = Created Status Code
            return response

        except IntegrityError:
            db.session.rollback()
            return make_response({"message": "Error creating user achievement. Please try again."}, 500)  # Internal Server Error

class UserBgInsResource(Resource):
    def _add_cache_headers(self, response):
        """Add no-cache headers to response"""
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    def _get_bg_ranges(self):
        """Fetch blood glucose ranges from bg_chart table"""
        try:
            query = text("SELECT min_range_mgdl, max_range_mgdl, risk_level, suggested_action FROM bg_chart ORDER BY level_id")
            result = db.session.execute(query)
            
            bg_ranges = []
            for row in result:
                # Strip any trailing periods from suggested_action
                suggested_action = row.suggested_action.rstrip('.')
                
                bg_ranges.append({
                    'min': row.min_range_mgdl,
                    'max': row.max_range_mgdl,
                    'risk_level': row.risk_level.lower(),  # Convert to lowercase
                    'suggested_action': suggested_action
                })
            return bg_ranges
        except Exception as e:
            print(f"Error fetching bg ranges: {str(e)}")
            return []

    def _get_bg_message(self, bg_value, time_of_day=None):
        """Get blood glucose message with formatted output"""
        if bg_value is None:
            return None
            
        # Round the blood glucose value
        rounded_bg = round(float(bg_value))
        bg_ranges = self._get_bg_ranges()
        
        for range_info in bg_ranges:
            if range_info['min'] <= rounded_bg <= range_info['max']:
                if time_of_day:
                    return f"{time_of_day} Blood Glucose is on {range_info['risk_level']} level. {range_info['suggested_action']}."
                return f"{range_info['risk_level'].upper()} - {range_info['suggested_action']}"
                
        return 'Invalid blood glucose value'

    def _generate_summary(self, bg_morning, bg_afternoon, bg_evening):
        """Generate summary messages for blood glucose readings"""
        summary = []
        
        if bg_morning is not None:
            summary.append(self._get_bg_message(bg_morning, "Morning"))
            
        if bg_afternoon is not None:
            summary.append(self._get_bg_message(bg_afternoon, "Afternoon"))
            
        if bg_evening is not None:
            summary.append(self._get_bg_message(bg_evening, "Evening"))
            
        return summary

    def _format_entry_response(self, entry):
        """Format the entry response with consistent message formatting"""
        return {
            'id': entry.id,
            'account_id': entry.account_id,
            'created_date': entry.created_at.strftime('%Y-%m-%d'),
            'bg_morning': entry.bg_morning if entry.bg_morning else None,
            'bg_morning_message': self._get_bg_message(entry.bg_morning, "Morning"),
            'bg_afternoon': entry.bg_afternoon if entry.bg_afternoon else None,
            'bg_afternoon_message': self._get_bg_message(entry.bg_afternoon, "Afternoon"),
            'bg_evening': entry.bg_evening if entry.bg_evening else None,
            'bg_evening_message': self._get_bg_message(entry.bg_evening, "Evening"),
            'ins_morning': entry.ins_morning if entry.ins_morning else None,
            'ins_afternoon': entry.ins_afternoon if entry.ins_afternoon else None,
            'ins_evening': entry.ins_evening if entry.ins_evening else None
        }

    def get(self, entry_id=None):
        """Get one or all entries with formatted messages"""
        if entry_id:
            # Get specific entry
            entry = UserBgIns.query.get_or_404(entry_id)
            response = make_response(self._format_entry_response(entry))
            return self._add_cache_headers(response)
        else:
            # Get all entries with optional filtering by account_id
            account_id = request.args.get('account_id', type=int)
            query = UserBgIns.query
            if account_id:
                account = Account.query.get(account_id)
                if not account:
                    return self._add_cache_headers(
                        make_response({"message": f'Invalid account_id: {account_id}'}, 400)
                    )
                query = query.filter_by(account_id=account_id)
            entries = query.order_by(UserBgIns.created_at.asc()).all()
            response = make_response([self._format_entry_response(entry) for entry in entries])
            return self._add_cache_headers(response)

    def post(self):
        """Create a new entry with formatted messages and summary"""
        data = request.get_json()
        
        # Validate required fields
        if 'account_id' not in data:
            return self._add_cache_headers(
                make_response({"message": 'account_id is required'}, 400)
            )
        
        account = Account.query.get(data['account_id'])
        if not account:
            return self._add_cache_headers(
                make_response({"message": f'Invalid account_id: {data["account_id"]}'}, 400)
            )

        # Create new entry
        new_entry = UserBgIns(
            account_id=data['account_id'],
            bg_morning=data.get('bg_morning'),
            bg_afternoon=data.get('bg_afternoon'),
            bg_evening=data.get('bg_evening'),
            ins_morning=data.get('ins_morning'),
            ins_afternoon=data.get('ins_afternoon'),
            ins_evening=data.get('ins_evening')
        )

        try:
            db.session.add(new_entry)
            db.session.commit()
            
            # Generate response
            response_data = self._format_entry_response(new_entry)
            response_data['message'] = 'Entry created successfully'
            
            # Add summary messages if any blood glucose values are present
            if any([new_entry.bg_morning, new_entry.bg_afternoon, new_entry.bg_evening]):
                response_data['summary'] = self._generate_summary(
                    new_entry.bg_morning,
                    new_entry.bg_afternoon,
                    new_entry.bg_evening
                )
            else:
                response_data['summary'] = []
            
            response = make_response(response_data, 201)
            return self._add_cache_headers(response)
            
        except Exception as e:
            db.session.rollback()
            return self._add_cache_headers(
                make_response({'message': f'Error creating entry: {str(e)}'}, 500)
            )

    def put(self, entry_id):
        """Update an existing entry"""
        entry = UserBgIns.query.get_or_404(entry_id)
        data = request.get_json()

        if 'account_id' in data:
            account = Account.query.get(data['account_id'])
            if not account:
                return self._add_cache_headers(
                    make_response({"message": f'Invalid account_id: {data["account_id"]}'}, 400)
                )

        # Update fields if provided
        for field in ['bg_morning', 'bg_afternoon', 'bg_evening', 
                     'ins_morning', 'ins_afternoon', 'ins_evening']:
            if field in data:
                setattr(entry, field, data[field])

        try:
            db.session.commit()
            response_data = self._format_entry_response(entry)
            response_data['message'] = 'Entry updated successfully'
            
            # Add summary for updated values
            if any([entry.bg_morning, entry.bg_afternoon, entry.bg_evening]):
                response_data['summary'] = self._generate_summary(
                    entry.bg_morning,
                    entry.bg_afternoon,
                    entry.bg_evening
                )
            else:
                response_data['summary'] = []
            
            response = make_response(response_data, 200)
            return self._add_cache_headers(response)
            
        except Exception as e:
            db.session.rollback()
            return self._add_cache_headers(
                make_response({'message': f'Error updating entry: {str(e)}'}, 500)
            )

    def delete(self, entry_id):
        """Delete an existing entry"""
        entry = UserBgIns.query.get_or_404(entry_id)
        try:
            db.session.delete(entry)
            db.session.commit()
            return self._add_cache_headers(
                make_response({'message': 'Entry deleted successfully'}, 200)
            )
        except Exception as e:
            db.session.rollback()
            return self._add_cache_headers(
                make_response({'message': f'Error deleting entry: {str(e)}'}, 500)
            )
class UserAchievementResource(Resource):
    def get(self):
        """Get user's current achievement status and points needed for next rank
        
        Required Query Parameter:
        - account_id: The ID of the user account
        
        Returns:
        - JSON with user's current achievement details and points needed for next rank
        """
        # Get account_id from query parameters
        account_id = request.args.get('account_id', type=int)
        
        # Validate input
        if not account_id:
            return make_response({"message": "account_id is required"}, 400)
            
        try:
            # Get user's current achievement
            user_achv = UserAchv.query.filter_by(account_id=account_id).first()
            if not user_achv:
                return make_response({"message": f"No achievement record found for account_id: {account_id}"}, 404)
            
            # Get achievement chart data for next rank calculation
            current_rank = user_achv.current_rank.upper()
            current_points = user_achv.current_points
            
            # Get the ranks from achievement chart
            achv_chart = AchvChart.query.all()
            ranks_map = {record.ranking: {"min": record.min_points, "max": record.max_points} 
                        for record in achv_chart}
            
            # Calculate points to next rank
            points_to_rank_up = "Max Level!"
            if current_rank != "GOLD":
                if current_rank == "BRONZE":
                    current_rank_max = ranks_map["BRONZE"]["max"]
                elif current_rank == "SILVER":
                    current_rank_max = ranks_map["SILVER"]["max"]
                    
                points_to_rank_up = (current_rank_max - current_points) + 5
                if points_to_rank_up < 0:
                    points_to_rank_up = 0
            
            # Construct response
            response = {
                "id": user_achv.id,
                "message": "Achievement data retrieved successfully",
                "firstName": user_achv.account.first_name,  # Assuming relationship exists in model
                "currentRank": current_rank,
                "currentPoints": current_points,
                "pointsToRankUp": points_to_rank_up
            }
            
            return make_response(response, 200)
            
        except Exception as e:
            return make_response({"message": f"Error retrieving achievement data: {str(e)}"}, 500)

class TestEnvironment(Resource):
    def get(self):
        # Return a safe subset of environment variables
        # Don't return passwords or sensitive data!
        return {
            "ENVIRONMENT": os.getenv('ENVIRONMENT', 'Not set'),
            "database_host": os.getenv('MYSQL_DATABASE_HOST', 'Not set'),
            "database_name": os.getenv('MYSQL_DATABASE_DB', 'Not set'),
            "database_user": os.getenv('MYSQL_DATABASE_USER', 'Not set'),
            # Don't include DATABASE_PASSWORD!
        }, 200

###########################
#    Add API Resources    #
###########################
api.add_resource(UserAchievementResource, '/getUserAchv')
api.add_resource(UserBgInsResource, '/entries', '/entries/<int:entry_id>')
api.add_resource(CreateUserAccount, '/createUserAccount')
api.add_resource(ValidateUserLogin, '/validateUserLogin')
api.add_resource(TestEnvironment, '/testEnv')


# Starts the Flask Application in Debug Mode
# Run this file and open a browser to view, go to the following default http://Hostname:Port
# Hostname:Port -  http://localhost:5000 || http://127.0.0.1:5000
# Note  -   With Debug Mode active, you cannot utilize the builtin debugger from an IDE such as Pycharm
#           See More information here: https://flask.palletsprojects.com/en/stable/debugging/#external-debuggers
def main():
    print("INFO: Running Locally")
    with app.app_context():
        init_db(environment)
        app.run(debug=True) # Utilize Flasks builtin auto-reload debugger
        # app.run(debug=True, use_debugger=False, use_reloader=False) # If you want to run with an External Debugger (e.g., PyCharm IDE Debugger)

if __name__ == '__main__':
    main()

# Initialization for Render
# Render doesn't utilize 'main()' function, it runs gunicorn app:app directly
# Check if this is Render Running this app, else its a unit test and for unit tests then -
#   we don't want it to enter this block of code because the unit tests have their own setup and teardown.
if (not db_initialized) and os.getenv('IS_RENDER').lower() == 'true':
    print("INFO: Running on PROD - Render Instance")
    with app.app_context():
        init_db(environment)


