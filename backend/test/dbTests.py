# External Imports
from dotenv import load_dotenv
from flask import Flask
import os
import unittest

# Internal Imports
from db import db, check_connection

class TestDatabaseConnection(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Create a test Flask app
        cls.app = Flask(__name__)

        # Load environment variables from .env file
        dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'src', '.env')
        load_dotenv(dotenv_path)

        # Configure test database (ensure this is a valid test database)
        cls.app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql+mysqlconnector://{os.getenv('MYSQL_DATABASE_USER')}:{os.getenv('MYSQL_DATABASE_PASSWORD')}@"
        f"{os.getenv('MYSQL_DATABASE_HOST')}:3306/{os.getenv('MYSQL_DATABASE_DB')}")
        cls.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        # Initialize the database with the app context
        with cls.app.app_context():
            db.init_app(cls.app)
    # Check Database Connection
    def test_database_connection(self):
        is_connected, message = check_connection(self.app)
        self.assertTrue(is_connected, msg=message)

if __name__ == '__main__':
    unittest.main()