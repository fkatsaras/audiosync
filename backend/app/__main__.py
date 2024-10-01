#!/usr/bin/env python3
import connexion

from app import encoder
from flask import send_from_directory
from dotenv import load_dotenv
from flask_cors import CORS

from app.routes.home import home_bp
from app.routes.auth import auth_bp
from app.routes.search import search_bp
from app.routes.song import song_bp
import os

load_dotenv()

def create_app():

    app = connexion.App(__name__, specification_dir='./api/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('api.yaml', arguments={'title': 'AudioSync API - OpenAPI 3.0'}, pythonic_params=True)

    flask_app = app.app

    # Specify allowed origin 
    CORS(flask_app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    blueprints = [home_bp, auth_bp, song_bp, search_bp]
    for blueprint in blueprints:
        flask_app.register_blueprint(blueprint=blueprint)

    # Configure the session (needed for session management)
    flask_app.secret_key = 'fotis'


    # Configure DB connection
    flask_app.config['DB_HOST'] = os.getenv('DB_HOST')
    flask_app.config['DB_USER'] = os.getenv('DB_USER')
    flask_app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD')
    flask_app.config['DB_NAME'] = os.getenv('DB_NAME')

    return flask_app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
