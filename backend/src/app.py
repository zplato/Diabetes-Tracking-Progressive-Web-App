# External Imports
from dotenv import load_dotenv
from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from decimal import Decimal
import os

# Local Imports
from db import db, check_connection
from models import Account, UserBgIns


# Flask Stuff
app = Flask(__name__)
CORS(app)
api = Api(app)

# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

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
                'bg_morning': str(entry.bg_morning) if entry.bg_morning else None,
                'bg_afternoon': str(entry.bg_afternoon) if entry.bg_afternoon else None,
                'bg_evening': str(entry.bg_evening) if entry.bg_evening else None,
                'ins_morning': str(entry.ins_morning) if entry.ins_morning else None,
                'ins_afternoon': str(entry.ins_afternoon) if entry.ins_afternoon else None,
                'ins_evening': str(entry.ins_evening) if entry.ins_evening else None
            }
        else:
            # Get all entries with optional filtering by account_id
            account_id = request.args.get('account_id', type=int)
            query = UserBgIns.query
            if account_id:
                # Verify account exists
                account = Account.query.get(account_id)
                if not account:
                    return {'message': f'Account with id {account_id} not found'}, 404
                query = query.filter_by(account_id=account_id)
            entries = query.order_by(UserBgIns.created_at.desc()).all()
            return [{
                'id': entry.id,
                'account_id': entry.account_id,
                'created_at': entry.created_at.isoformat(),
                'updated_at': entry.updated_at.isoformat(),
                'bg_morning': str(entry.bg_morning) if entry.bg_morning else None,
                'bg_afternoon': str(entry.bg_afternoon) if entry.bg_afternoon else None,
                'bg_evening': str(entry.bg_evening) if entry.bg_evening else None,
                'ins_morning': str(entry.ins_morning) if entry.ins_morning else None,
                'ins_afternoon': str(entry.ins_afternoon) if entry.ins_afternoon else None,
                'ins_evening': str(entry.ins_evening) if entry.ins_evening else None
            } for entry in entries]

    def post(self):
        data = request.get_json()
        
        # Validate required fields
        if 'account_id' not in data:
            return {'message': 'account_id is required'}, 400
        
        account = Account.query.get(data['account_id'])
        if not account:
            return {'message': f'Account with id {data["account_id"]} not found'}, 404

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
                return {'message': f'Account with id {data["account_id"]} not found'}, 404

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

# Add these routes to your API resources
api.add_resource(UserBgInsResource, '/entries', '/entries/<int:entry_id>')


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



