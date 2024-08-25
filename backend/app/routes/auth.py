from flask import Blueprint
from app.controllers.authorization_controller import *
from werkzeug.security import generate_password_hash, check_password_hash

# TEST : In-memory user store for demonstration
users = {
    "testuser": generate_password_hash("testpassword") 
}

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_route():
    return login(users)

@auth_bp.route('/logout', methods=['POST']) # Using only POST method for avoiding CSRF attacks
def logout_route():
    return logout()

@auth_bp.route('/current_user', methods=['GET'])
def current_user_route():
    return current_user()