from flask import Blueprint
from app.controllers.authorization_controller import *
from app.controllers.users_controller import login_user, logout_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/v1/users/check-login', methods=['GET'])
def check_login_route():
    return check_login()

@auth_bp.route('/api/v1/users/login', methods=['POST'])
def login_route():
    return login_user()

@auth_bp.route('/api/v1/users/logout', methods=['POST']) # Using only POST method for avoiding CSRF attacks
def logout_route():
    return logout_user()