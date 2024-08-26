from typing import List

from flask import request, jsonify, session, redirect, url_for, render_template
from werkzeug.security import check_password_hash
from app.models.user_entity import UserEntity
import jwt
import datetime
from functools import wraps

"""
controller generated to handled auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
def check_AudioSync_auth(token):
    return {'scopes': ['read:pets', 'write:pets'], 'uid': 'test_value'}

def validate_scope_AudioSync_auth(required_scopes, token_scopes):
    return set(required_scopes).issubset(set(token_scopes))

def check_api_key(api_key, required_scopes):
    return {'test_key': 'test_value'}


#-------------------------------------------------------------------------------------

# Secret key for JWT (use an environment variable in production)
SECRET_KEY = "fotis"

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1]  # Get token part from 'Bearer <token>'
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['username']
        except Exception as e:
            print(f"Error decoding token: {e}")
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)

    return decorator

def login(users):
    if request.method == 'POST':
        if request.is_json:
            # Handle JSON data
            data = request.get_json()
        else:
            # Handle form data
            data = request.form
        
        username = data.get("username")
        password = data.get("password")

        print(f"D> Login attempt - Username: {username}, Password: {password}")

        # Check credentials against in-memory user store
        stored_password_hash = users.get(username)
        print(f"D> Stored password hash for {username}: {stored_password_hash}")
        
        if stored_password_hash and check_password_hash(stored_password_hash, password):
            print("D> Credentials are valid")
            
            # Generate a JWT token
            token = jwt.encode({
                'username': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, SECRET_KEY, algorithm="HS256")

            # Store user ID in session
            session['user.id'] = username
            print(f"D> Session user ID set to: {session.get('user.id')}")
            print(f"D> Generated token: {token}")

            # Return the token as a JSON response
            return jsonify({'token': token}), 200
        else:
            print("D> Invalid credentials")
            return jsonify({'message': 'Invalid credentials'}), 401

    # Return a 405 Method Not Allowed response for non-POST methods
    return jsonify({'message': 'Method Not Allowed'}), 405

def logout():
    session.pop('username', None)
    return jsonify({'message': "Logged out successfully!"}), 200

def current_user():
    username = session.get('username')
    if username:
        return jsonify({"username": username}), 200
    return jsonify({"message": "No user logged in"}), 401