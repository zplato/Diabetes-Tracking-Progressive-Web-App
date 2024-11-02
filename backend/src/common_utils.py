# File for storing common utility functions

# External Imports
from datetime import datetime

# Validates dob, returns True if dob format matches YYYY-MM-DD, else returns False
# Example True - "1995-04-23"
# Example False - "1995-April-23"
def valid_dob(dob_str):
    try:
        datetime.strptime(dob_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False