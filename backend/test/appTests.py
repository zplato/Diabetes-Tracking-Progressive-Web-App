# External Imports
from datetime import datetime
from flask import Flask
import json
import unittest

from jinja2.compiler import generate
from werkzeug.security import generate_password_hash

# Internal Imports
from db import db
from models import Account
from src.app import app


class testBackendEndpoints(unittest.TestCase):

    # Create the test client
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Use to tear down any test resources
    def tearDown(self):
        pass

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
        self.app = app.test_client()
        self.app.testing = True

    def tearDown(self):
        pass

    def test_create_user_success(self):
        data = {
            "username": "testuser",
            "password": "testpassword",
            "firstname": "Test",
            "lastname": "User",
            "dob": "1990-01-01"
        }
        response = self.app.post('/createUserAccount', json=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['message'], 'User created successfully')

        user = Account.query.filter_by(username='testuser').first()
        self.assertIsNotNone(user)
        self.assertEqual(user.firstname, 'Test')
        self.assertEqual(user.lastname, 'User')
        self.assertEqual(user.dob, datetime.date(1990, 1, 1))

if __name__ == '__main__':
    unittest.main()