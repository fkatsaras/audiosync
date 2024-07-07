#!/usr/bin/env python3

import connexion

from app import encoder
from flask import Flask
from app.routes.home import home_bp


def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Swagger AudioSync - OpenAPI 3.0'}, pythonic_params=True)

    # Register the blueprint
    flask_app = app.app
    flask_app.register_blueprint(home_bp)

    app.run(port=8080)


if __name__ == '__main__':
    main()
