# External Imports
from datetime import datetime, date
from flask import Flask
import json
import os
import unittest

from jinja2.compiler import generate
from werkzeug.security import generate_password_hash

# Internal Imports
from db import db
from models import Account
from src.app import app, init_db


# This Class of unit tests validate the 'validateUser' endpoint
#
class TestValidateUser(unittest.TestCase):

    # Create the test client
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Create new application context for testing
        with app.app_context():
            init_db("PROD")

    # Use to tear down any test resources
    def tearDown(self):
        with app.app_context():
            db.session.remove()
        # app.app_context.pop() # Tear down is already within context, no need to force a pop to remove it

    # test @app.route('/')
    def test_home_route(self):
        response = self.app.get('/') # Test GET response
        self.assertEqual(response.status_code, 200)

        # Can add other tests here for root endpoint ('/'), e.g., POST

    # test @app.route('/validateUserLogin')
    def test_login_success(self):
        response = self.app.post('/validateUserLogin',
                                 data=json.dumps({"username": "Annatar", "password": "IAmSauron"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Login successful", response.get_data(as_text=True))

    def test_login_invalid_username(self):
        response = self.app.post('/validateUserLogin',
                                 data=json.dumps({"username": "invalid_user", "password": "password123"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid username or password", response.get_data(as_text=True))

    def test_login_invalid_password(self):
        response = self.app.post('/validateUserLogin',
                                 data=json.dumps({"username": "RingsBearerSidekick", "password": "wrongpassword"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid username or password", response.get_data(as_text=True))

    def test_login_missing_fields(self):
        response = self.app.post('/validateUserLogin',
                                 data=json.dumps({"username": "user1"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("Username and password are required", response.get_data(as_text=True))

class TestCreateUserAccount(unittest.TestCase):
    def setUp(self):

        """Set up the testing environment."""
        self.app = app
        self.app.config['TESTING'] = True  # Enable testing mode
        self.client = self.app.test_client()

        with self.app.app_context():
            init_db("TEST")
            db.create_all()  # Create database tables

    def tearDown(self):
        """Clean up after each test."""
        with self.app.app_context():
            db.session.remove()
            # db.drop_all()  # Drop tables - only do this if you're using in-memory db.

    def test_create_user_success(self):
        """Test creating a user successfully."""
        dob = date(1995, 4, 23).isoformat() # Convert to date object
        response = self.client.post('/createUserAccount',
                                     data=json.dumps({
                                         "username": "new_user3",
                                         "password": "password123",
                                         "firstname": "John",
                                         "middlename": "Doe",
                                         "lastname": "Smith",
                                         "dob": dob
                                     }),
                                     content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertIn(b'User created successfully', response.data)

if __name__ == '__main__':
    unittest.main()