import unittest
from src.app import app

class testBackendEndpoints(unittest.TestCase):

    # Create the test client
    def setUp(self):
        self.app = app.test_client()

    # Use to tear down any test resources
    def tearDown(self):
        pass

    # test @app.route('/')
    def test_home_route(self):
        response = self.app.get('/') # Test GET response
        self.assertEqual(response.status_code, 200)

        # Can add other tests here for root endpoint ('/'), e.g., POST


if __name__ == '__main__':
    unittest.main()