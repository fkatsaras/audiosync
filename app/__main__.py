#!/usr/bin/env python3

import connexion

from app import encoder
from flask import Flask, Blueprint, jsonify
from app.models.home_page_response import HomePageResponse, HomePageResponseLinks

def create_app():
    app = Flask(__name__, static_url_path='/static', static_folder='app/static')
    app.config['SECRET_KEY'] = 'my_secret_key'

    # Register blueprints here
    from app.routes.home import home_bp
    app.register_blueprint(home_bp)

    return app



def main():
    flask_app = create_app()

    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Swagger AudioSync - OpenAPI 3.0'}, pythonic_params=True)
    app.run(port=8080)
    flask_app.run(port=8080)


if __name__ == '__main__':
    main()
