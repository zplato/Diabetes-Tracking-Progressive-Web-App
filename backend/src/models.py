from db import db
from datetime import datetime

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
    # ranking = db.Column(db.Integer)
    # points = db.Column(db.Integer)

# Add Additional Tables below
class UserBgIns(db.Model):
    __tablename__ = 'user_bg_ins'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    bg_morning = db.Column(db.Numeric(18,2))
    bg_afternoon = db.Column(db.Numeric(18,2))
    bg_evening = db.Column(db.Numeric(18,2))
    ins_morning = db.Column(db.Numeric(18,2))
    ins_afternoon = db.Column(db.Numeric(18,2))
    ins_evening = db.Column(db.Numeric(18,2))

    # Add relationship to Account model
    account = db.relationship('Account', backref=db.backref('bg_ins_entries', lazy=True))