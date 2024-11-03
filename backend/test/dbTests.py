# External Imports
from dotenv import load_dotenv
from flask import Flask
import os
import unittest

# Internal Imports
from db import db, check_connection
from src.app import app, init_db

# Note - the two tests in here need to be ran independently to work properly
class TestDatabaseConnection(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        """Set up the testing environment."""
        self.app = app
        self.app.config['TESTING'] = True  # Enable testing mode
        self.client = self.app.test_client()

    def tearDown(self):
        """Clean up after each test."""
        with self.app.app_context():
            db.session.remove()

    # Check PROD Database Connection
    def test_PROD_database_connection(self):
        with self.app.app_context():
            init_db("PROD")
            is_connected, message = check_connection(self.app)
        self.assertTrue(is_connected, msg=message)

    # Check TEST Database Connection
    def test_TEST_database_connection(self):
        with self.app.app_context():
            init_db("TEST")
            is_connected, message = check_connection(self.app)
        self.assertTrue(is_connected, msg=message)

if __name__ == '__main__':
    unittest.main()