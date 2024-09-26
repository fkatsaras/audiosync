#!/usr/bin/env python3
import connexion

from app import encoder
from flask import Flask, send_from_directory
from dotenv import load_dotenv
from flask_cors import CORS
import logging

from app.routes.home import home_bp
from app.routes.auth import auth_bp
from app.routes.landing import landing_bp
from app.routes.api import api
import os

load_dotenv()

# Set up color coding for different log levels
class ColoredFormatter(logging.Formatter):
    COLORS = {
        "DEBUG": "\033[90m",    # Grey
        "INFO": "\033[92m",     # Green
        "WARNING": "\033[93m",  # Yellow
        "ERROR": "\033[91m",    # Red
        "CRITICAL": "\033[95m", # Magenta
    }
    RESET = "\033[0m"

    def format(self, record):
        log_msg = super().format(record)
        color = self.COLORS.get(record.levelname, self.RESET)
        return f"{color}{log_msg}{self.RESET}"

# Configure the root logger
def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)  # Adjust as needed

    # Create a console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)

    # Define the log message format
    formatter = ColoredFormatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    console_handler.setFormatter(formatter)

    # Add the handler to the root logger
    logger.addHandler(console_handler)

def create_app():

    # Initialize loggin 
    setup_logging()
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Swagger AudioSync - OpenAPI 3.0'}, pythonic_params=True)

    flask_app = app.app

    # Specify allowed origin 
    CORS(flask_app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    blueprints = [home_bp, auth_bp, landing_bp, api]
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
