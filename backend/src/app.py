# External Imports
from dotenv import load_dotenv
from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from decimal import Decimal
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json

# Local Imports
from common_utils import valid_dob
from db import db, check_connection
from models import Account, UserBgIns, UserAchv


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
db_initialized = False

###########################
#      Database Init      #
###########################
def init_db(env):
    if 'SQLALCHEMY_DATABASE_URI' not in app.config: # If we don't already have a db for this sessions context
        print("Initializing DB")

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
            print("Check your .env file and ensure that you've specified the correct environment and try again. ")
            exit(1)

        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False    # Not using the Flask-SQLAlchemy's event system, set explicitly to false in order to get rid of warning
        db.init_app(app)                                        # Bind the app to the db instance

    global db_initialized
    db_initialized = True
    is_connected, message = check_connection(app)           # Verify the database connection
    print(message)                                          # Printing to the STDOUT is fine for now

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
            return {"message": "Username and password are required"}, 400

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
            return {"message": "Invalid username or password"}, 401

# This API does a couple of things:
# 1. Creates User Account and saves account information to the 'accounts' table
# 2. Creates Default User Achievement record linked to account and saves it in the user achievement
class CreateUserAccount(Resource):
    def post(self):

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
            return {"message": invalid_input_message }, 400

        # Validate username - check if it already exists
        # Query the database for the user using SQLAlchemy ORM
        user = Account.query.filter_by(username=username).first()
        if user:
            already_existing_user_message = "Username already exists"
            return {"message": already_existing_user_message}, 409 # Conflict - username already exists

        # Validate dob
        is_valid_dob, formatted_dob = valid_dob(dob)
        if not is_valid_dob:
            not_valid_dob_message = "Not a valid dob, ensure its formatted as YYYY-MM-DD"
            return {"message": not_valid_dob_message}, 400

        # At this point, everything is gucci - lets create that user!
        hashed_password = generate_password_hash(password)
        new_user = Account(
            username=username,
            password=hashed_password,
            first_name=firstname,
            mid_name=middlename,
            last_name=lastname,
            dob=formatted_dob,
            hapi_fhir_response="" # Empty String here - as at this point we don't have a response to give
        )

        # Add the new user to the session and commit
        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"message": "Error creating user. Please try again."}, 500  # Internal Server Error

        # Add Default User Achievement - Now that the User Account is created and ID is initialized
        default_rank = "Bronze"
        default_num_points = 0
        default_achievement = UserAchv(
            current_rank = default_rank,
            current_points = default_num_points
        )

        # Add the default user achievement record to the session and commit
        db.session.add(default_achievement)
        try:
            db.session.commit()
            return {"message": "User created successfully"}, 201  # Created User Account and Achievement record
        except IntegrityError:
            db.session.rollback()
            return {"message": "Error creating user achievement. Please try again."}, 500  # Internal Server Error


class UserBgInsResource(Resource):
    def get(self, entry_id=None):
        if entry_id:
            # Get specific entry
            entry = UserBgIns.query.get_or_404(entry_id)
            return {
                'id': entry.id,
                'account_id': entry.account_id,
                'created_at': entry.created_at.isoformat(),
                'updated_at': entry.updated_at.isoformat(),
                'bg_morning': entry.bg_morning if entry.bg_morning else None,
                'bg_afternoon': entry.bg_afternoon if entry.bg_afternoon else None,
                'bg_evening': entry.bg_evening if entry.bg_evening else None,
                'ins_morning': entry.ins_morning if entry.ins_morning else None,
                'ins_afternoon': entry.ins_afternoon if entry.ins_afternoon else None,
                'ins_evening': entry.ins_evening if entry.ins_evening else None
            }
        else:
            # Get all entries with optional filtering by account_id
            account_id = request.args.get('account_id', type=int)
            query = UserBgIns.query
            if account_id:
                # Verify account exists
                account = Account.query.get(account_id)
                if not account:
                    return {
                        'message': f'Invalid account_id: {account_id}'
                    }, 400
                query = query.filter_by(account_id=account_id)
            entries = query.order_by(UserBgIns.created_at.asc()).all()
            print(entries)
            return [{
                'id': entry.id,
                'account_id': entry.account_id,
                'created_at': entry.created_at.isoformat(),
                'updated_at': entry.updated_at.isoformat(),
                'bg_morning': entry.bg_morning if entry.bg_morning else None,
                'bg_afternoon': entry.bg_afternoon if entry.bg_afternoon else None,
                'bg_evening': entry.bg_evening if entry.bg_evening else None,
                'ins_morning': entry.ins_morning if entry.ins_morning else None,
                'ins_afternoon': entry.ins_afternoon if entry.ins_afternoon else None,
                'ins_evening': entry.ins_evening if entry.ins_evening else None
            } for entry in entries]

    def post(self):
        data = request.get_json()
        
        # Validate required fields
        if 'account_id' not in data:
            return {'message': 'account_id is required'}, 400
        
        account = Account.query.get(data['account_id'])
        if not account:
             return {
                'message': f'Invalid account_id: {data["account_id"]}'
            }, 400

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
            return {
                'message': 'Entry created successfully',
                'id': new_entry.id
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating entry: {str(e)}'}, 500

    def put(self, entry_id):
        entry = UserBgIns.query.get_or_404(entry_id)
        data = request.get_json()

        if 'account_id' in data:
            account = Account.query.get(data['account_id'])
            if not account:
                return {
                    'message': f'Invalid account_id: {data["account_id"]}'
                }, 400

        # Update fields if provided
        if 'bg_morning' in data:
            entry.bg_morning = data['bg_morning']
        if 'bg_afternoon' in data:
            entry.bg_afternoon = data['bg_afternoon']
        if 'bg_evening' in data:
            entry.bg_evening = data['bg_evening']
        if 'ins_morning' in data:
            entry.ins_morning = data['ins_morning']
        if 'ins_afternoon' in data:
            entry.ins_afternoon = data['ins_afternoon']
        if 'ins_evening' in data:
            entry.ins_evening = data['ins_evening']

        try:
            db.session.commit()
            return {'message': 'Entry updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error updating entry: {str(e)}'}, 500

    def delete(self, entry_id):
        entry = UserBgIns.query.get_or_404(entry_id)
        try:
            db.session.delete(entry)
            db.session.commit()
            return {'message': 'Entry deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error deleting entry: {str(e)}'}, 500

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
api.add_resource(UserBgInsResource, '/entries', '/entries/<int:entry_id>')
api.add_resource(CreateUserAccount, '/createUserAccount')
api.add_resource(ValidateUserLogin, '/validateUserLogin')
api.add_resource(TestEnvironment, '/testEnv')


# Starts the Flask Application in Debug Mode
# Run this file and open a browser to view, go to the following default http://Hostname:Port
# Hostname:Port -  http://localhost:5000 || http://127.0.0.1:5000
def main():
    print("Running Locally")
    with app.app_context():
        init_db(environment)
        app.run(debug=True)

if __name__ == '__main__':
    main()

# Initialization for Render
# Render doesn't utilize 'main()' function,it runs gunicorn app:app directly
if not db_initialized:
    print("Running on PROD - Render Instance")
    with app.app_context():
        init_db(environment)


