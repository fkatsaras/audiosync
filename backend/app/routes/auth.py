from flask import Blueprint
from app.controllers.authorization_controller import *
from app.controllers.users_controller import login_user, logout_user

from flask import request, jsonify, session


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/check-login', methods=['GET'])
def check_login_route():
    return check_login()

@auth_bp.route('/login', methods=['POST'])
def login_route():
    # Connexion will handle extracting username and password based on OpenAPI
    return login_user()

@auth_bp.route('/logout', methods=['POST']) # Using only POST method for avoiding CSRF attacks
def logout_route():
    return logout_user()