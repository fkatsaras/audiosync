#!/usr/bin/env python3
import connexion

from app import encoder
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

from app.routes.home import home_bp
from app.routes.auth import auth_bp
from app.routes.landing import landing_bp
from app.routes.api import api

load_dotenv()

def create_app():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Swagger AudioSync - OpenAPI 3.0'}, pythonic_params=True)

    flask_app = app.app

    CORS()

    # Register blueprints
    flask_app.register_blueprint(home_bp)
    flask_app.register_blueprint(auth_bp)
    flask_app.register_blueprint(landing_bp)
    flask_app.register_blueprint(api)

    # Configure the session (needed for session management)
    flask_app.secret_key = 'fotis'

    return flask_app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
