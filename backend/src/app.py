from flask import Flask
from flask_restful import Api
from flask_cors import CORS


# Flask Stuff
app = Flask(__name__)
CORS(app)
api = Api(app)


# Home Route
@app.route('/')
def hello_world():
    return 'Hello, World!'