from typing import List

from flask import request, jsonify, session, redirect, url_for, render_template
from werkzeug.security import check_password_hash
from app.models.user_entity import UserEntity
import jwt
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

def logout():
    session.pop('username', None)
    return jsonify({'message': "Logged out successfully!"}), 200

def current_user():
    username = session.get('username')
    if username:
        return jsonify({"username": username}), 200
    return jsonify({"message": "No user logged in"}), 401