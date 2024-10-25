import unittest
import json
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
                                 data=json.dumps({"username": "user1", "password": "password123"}),
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
                                 data=json.dumps({"username": "user1", "password": "wrongpassword"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid username or password", response.get_data(as_text=True))

    def test_login_missing_fields(self):
        response = self.app.post('/validateUserLogin',
                                 data=json.dumps({"username": "user1"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("Username and password are required", response.get_data(as_text=True))


if __name__ == '__main__':
    unittest.main()