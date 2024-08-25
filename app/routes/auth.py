from flask import Blueprint
from app.controllers.authorization_controller import *

# TEST : In-memory user store for demonstration
users = {
    "testuser": "testpassword" 
}

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_route():
    return login()

@auth_bp.route('/logout', methods=['POST'])
def logout_route():
    return logout()

@auth_bp.route('/current_user', methods=['GET'])
def current_user_route():
    return current_user()