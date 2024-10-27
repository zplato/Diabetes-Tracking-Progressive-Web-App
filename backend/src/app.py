from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()  # This will load .env file if it exists

# Flask Stuff
app = Flask(__name__)
CORS(app)
api = Api(app)


# Home Route
# Don't touch this, lets leave as is until we have reason not to.
@app.route('/')
def home_endpoint():
    return 'CS6440 Team 62 Group Project! Fall 2024.'

# TODO: Replace this with a REAL database
# Mock database of users
users_db = {
    "user1": {
        "id": 1,
        "username": "user1",
        "first_name": "John",
        "password": generate_password_hash("password123")
    },
    "user2": {
        "id": 2,
        "username": "user2",
        "first_name": "Jane",
        "password": generate_password_hash("mypassword")
    }
}

# Endpoint to validate the user login
# can be tested with curl - curl -X POST http://127.0.0.1:5000/validateUserLogin \
# -H "Content-Type: application/json" \
# -d '{"username": "user1", "password": "password123"}'
class ValidateUserLogin(Resource):
    def post(self):
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        # Validate input
        if not username or not password:
            return {"message": "Username and password are required"}, 400

        # Check if user exists
        user = users_db.get(username)
        if user and check_password_hash(user["password"], password):
            return {
                "id": user["id"],
                "message": "Login successful",
                "username": user["username"],
                "first_name": user["first_name"]
            }, 200
        else:
            return {"message": "Invalid username or password"}, 401

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

# Add resources to api
api.add_resource(ValidateUserLogin, '/validateUserLogin')
api.add_resource(TestEnvironment, '/testEnv')


# Starts the Flask Application in Debug Mode
# Run this file and open a browser to view, go to the following default http://Hostname:Port
# Hostname:Port -  http://localhost:5000 || http://127.0.0.1:5000
if __name__ == '__main__':
    app.run(debug=True)



