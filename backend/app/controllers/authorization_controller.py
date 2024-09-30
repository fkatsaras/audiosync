from typing import List

from flask import request, jsonify, session, redirect, url_for, render_template
from werkzeug.security import check_password_hash
from app.models.user_entity import UserEntity
from app.utils.logging_config import get_logger
from app.models.api_response import ApiResponse
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

# Initialize logger
logger = get_logger(__name__)

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
            logger.warning("Missing token in request")
            response = ApiResponse(code=403, type='error', message='Token is missing!')
            return jsonify(response.to_dict()), 403

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['username']
            logger.info(f"Token verified for user: {current_user}")
        except Exception as e:
            logger.error(f"Error decoding token: {e}")
            response = ApiResponse(code=403, type='error', message='Token is invalid!')
            return jsonify(response.to_dict()), 403

        return f(current_user, *args, **kwargs)

    return decorator

def check_login():
    if 'user.id' in session:
        username = session.get('username')
        response = ApiResponse(code=200, type='success', message=f'User {username} is logged in.')
        return jsonify(response.to_dict()), 200
    response = ApiResponse(code=401, type='error', message='User is not logged in.')
    return jsonify(response.to_dict()), 401

# def logout():
#     logger.info(f"User {session.get('username')} logged out")
#     session.pop('username', None)
#     response = ApiResponse(code=200, type='success', message="Logged out successfully!")
#     return jsonify(response.to_dict()), 200

def current_user():
    username = session.get('username')
    if username:
        logger.info(f"Current user: {username}")
        response = ApiResponse(code=200, type='success', message=f"Current user: {username}")
        return jsonify(response.to_dict()), 200
    logger.warning("No user logged in")
    response = ApiResponse(code=401, type='error', message="No user logged in")
    return jsonify(response.to_dict()), 401