from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

# Initialize the db
db = SQLAlchemy()

# Verify connectivity to the database
def check_connection(app):
    with app.app_context():
        try:
            # Get a connection from the engine and execute a simple query
            with db.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return True, "Database connection is successful."
        except OperationalError as e:
            return False, f"Database connection failed: {str(e)}"
        except Exception as e:
            return False, f"An error occurred: {str(e)}"