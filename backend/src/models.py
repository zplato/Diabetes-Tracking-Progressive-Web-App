from db import db

# Define the Accounts Table to interact with SQLAlchemy ORM
class Account(db.Model):
    __tablename__ = 'accounts'

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    mid_name = db.Column(db.String(50))
    dob = db.Column(db.Date)
    hapi_fhir_response = db.Column(db.Text)

# Add Additional Tables below