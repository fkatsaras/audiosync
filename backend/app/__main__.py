#!/usr/bin/env python3
import connexion

from app import encoder
from flask import send_from_directory
from dotenv import load_dotenv
from flask_cors import CORS
import logging

from app.routes.home import home_bp
from app.routes.auth import auth_bp
from app.routes.search import search_bp
from app.routes.song import song_bp
import os

load_dotenv()

def create_app():

    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Swagger AudioSync - OpenAPI 3.0'}, pythonic_params=True)

    flask_app = app.app

    # Specify allowed origin 
    CORS(flask_app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    blueprints = [home_bp, auth_bp, song_bp, search_bp]
    for blueprint in blueprints:
        flask_app.register_blueprint(blueprint=blueprint)

    # Configure the session (needed for session management)
    flask_app.secret_key = 'fotis'

    # Serve React build files 
    @flask_app.route('/', defaults={'path': ''})
    @flask_app.route('/<path:path>')
    def serve_react(path):
        if path != "" and os.path.exists(os.path.join('../frontend/build', path)):
            return send_from_directory('../frontend/build', path)
        else: 
            return send_from_directory('../frontend/build', 'index.html')

    return flask_app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
