from flask import Blueprint
from app.controllers.authorization_controller import *
from app.controllers.users_controller import login_user, logout_user

from flask import request, jsonify, session


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login_route():
    if request.method == 'POST':
        if request.is_json:
            # Handle JSON data
            data = request.get_json()
        else:
            # Handle form data
            data = request.form
        
        username = data.get("username")
        password = data.get("password")

        # Call user login controller
        return login_user(username=username, password=password)

    # Return a 405 Method Not Allowed response for non-POST methods
    return jsonify({'message': 'Method Not Allowed'}), 405

@auth_bp.route('/logout', methods=['POST']) # Using only POST method for avoiding CSRF attacks
def logout_route():
    return logout()

@auth_bp.route('/current_user', methods=['GET'])
def current_user_route():
    return current_user()