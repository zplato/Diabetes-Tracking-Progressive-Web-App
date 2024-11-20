from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

# Initialize the db
db = SQLAlchemy()

# Verify connectivity to the database
def check_connection(app):

    database_type = get_database_type(app)
    try:
        # Get a connection from the engine and execute a simple query
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True, "INFO: Database connection is successful. Connected to " + database_type
    except OperationalError as e:
        return False, f"ERROR: Database connection failed: {str(e)}"
    except Exception as e:
        return False, f"ERROR: An error occurred: {str(e)}"

def get_database_type(app):
    """Return the type of database being used."""
    database_uri = app.config['SQLALCHEMY_DATABASE_URI']

    if database_uri.startswith('sqlite'):
        return 'SQLite'
    elif database_uri.startswith('mysql'):
        return 'MySQL'
    else:
        return 'ERROR: Unknown Database'