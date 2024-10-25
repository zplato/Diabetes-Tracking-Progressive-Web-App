from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

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


# Add resources to api
api.add_resource(ValidateUserLogin, '/validateUserLogin')


# Starts the Flask Application in Debug Mode
# Hostname:Port -  http://localhost:5000 || http://127.0.0.1:5000
if __name__ == '__main__':
    app.run(debug=True)



