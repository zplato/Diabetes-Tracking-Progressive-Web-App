from flask import Flask
from flask_restful import Api
from flask_cors import CORS


# Flask Stuff
app = Flask(__name__)
CORS(app)
api = Api(app)


# Home Route
# Don't touch this, lets leave as is until we have reason not to.
@app.route('/')
def hello_world():
    return 'CS6440 Team 62 Group Project! Fall 2024.'



