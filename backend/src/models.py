from sqlalchemy import Nullable

from db import db
from datetime import datetime, timezone


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
    # ranking = db.Column(db.Integer)
    # points = db.Column(db.Integer)

# Define the User Blood Glucose and Insulin Records Table
class UserBgIns(db.Model):
    __tablename__ = 'user_bg_ins'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    bg_morning = db.Column(db.Numeric(18,2))
    bg_afternoon = db.Column(db.Numeric(18,2))
    bg_evening = db.Column(db.Numeric(18,2))
    ins_morning = db.Column(db.Numeric(18,2))
    ins_afternoon = db.Column(db.Numeric(18,2))
    ins_evening = db.Column(db.Numeric(18,2))

    # Add relationship to Account model
    account = db.relationship('Account', backref=db.backref('bg_ins_entries', lazy=True))

# Define the User Achievement Table
class UserAchv(db.Model):
    __tablename__ = 'user_achv'

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    current_rank = db.Column(db.String(20), nullable=False)
    current_points = db.Column(db.Integer, nullable=False)  # Changed from String to Integer

    # Add relationship to Account model
    # Allows you to easily retrieve the user associated achievements from the account object
    account = db.relationship('Account', backref=db.backref('user_achv_entry', lazy=True))

# Define the Achievement Chart Table
class AchvChart(db.Model):
    __tablename__ = 'achv_chart'

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    ranking = db.Column(db.String(20), nullable=False)
    min_points = db.Column(db.Integer, nullable=False)
    max_points = db.Column(db.Integer, nullable=False)

class BgChart(db.Model):
    __tablename__ = 'bg_chart'

    #Columns
    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, nullable=False)
    min_range_mgdl = db.Column(db.Integer, nullable=False)
    max_range_mgdl = db.Column(db.Integer, nullable=False)
    risk_level = db.Column(db.String(20), nullable=False)
    suggested_action = db.Column(db.String(50), nullable=False)

