# External Imports
from dotenv import load_dotenv
from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Local Imports
from common_utils import valid_dob
from db import db, check_connection
from models import Account

# Flask Stuff
app = Flask(__name__)
CORS(app)
api = Api(app)

# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

# Global Default Vars
default_rank = "Bronze"
default_num_points = 0


###########################
#      Database Init      #
###########################
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+mysqlconnector://{os.getenv('MYSQL_DATABASE_USER')}:{os.getenv('MYSQL_DATABASE_PASSWORD')}@"
    f"{os.getenv('MYSQL_DATABASE_HOST')}:3306/{os.getenv('MYSQL_DATABASE_DB')}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False    # Not using the Flask-SQLAlchemy's event system, set explicitly to false in order to get rid of warning
db.init_app(app)                                        # Bind the app to the db instance
is_connected, message = check_connection(app)           # Verify the database connection
print(message)                                          # Printing to the STDOUT is fine for now

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
        if not valid_dob(dob):
            not_valid_dob_message = "Not a valid dob, ensure its formatted as YYYY-MM-DD"
            return {"message": not_valid_dob_message}, 400

        # At this point, everything is gucci - lets create that user!
        hashed_password = generate_password_hash(password)
        new_user = Account(
            username=username,
            password=hashed_password,
            firstname=firstname,
            middlename=middlename,
            lastname=lastname,
            dob=dob
        )

        # Add the new user to the session and commit
        db.session.add(new_user)
        try:
            db.session.commit()
            return {"message": "User created successfully"}, 201  # Created
        except IntegrityError:
            db.session.rollback()
            return {"message": "Error creating user. Please try again."}, 500  # Internal Server Error

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
api.add_resource(ValidateUserLogin, '/validateUserLogin')
api.add_resource(TestEnvironment, '/testEnv')


# Starts the Flask Application in Debug Mode
# Run this file and open a browser to view, go to the following default http://Hostname:Port
# Hostname:Port -  http://localhost:5000 || http://127.0.0.1:5000
if __name__ == '__main__':
    app.run(debug=True)



