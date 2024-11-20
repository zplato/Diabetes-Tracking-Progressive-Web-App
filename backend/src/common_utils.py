# File for storing common utility functions

# External Imports
from datetime import datetime

# Validates dob, returns True if dob format matches YYYY-MM-DD, else returns False
# Example True - "1995-04-23"
# Example False - "1995-April-23"
def valid_dob(dob_str):
    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        return True, dob
    except ValueError:
        return False, None

# Build a Data Struct based off patient data to prep to send to FHIR server
def build_patient_resource(firstname, lastname, dob):

    data = {
        "resourceType": "Patient",
        "active": True,
        "name": [
            {
                "use": "official",
                "family": lastname,
                "given": firstname
            }
        ],
        "birthDate": dob
    }

    return data