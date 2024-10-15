from typing import List
import requests
from flask import request, jsonify, session
from app.utils.logging_config import get_logger
from app.controllers.api_controller import *
import jwt
from functools import wraps
import base64
from dotenv import load_dotenv
import os

"""
controller generated to handled auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
def check_AudioSync_auth(token):
    """
    Authenticates a token (e.g., JWT) and returns user details like ID and scopes (permissions).
    """
    return {'scopes': ['read:pets', 'write:pets'], 'uid': 'test_value'}

def validate_scope_AudioSync_auth(required_scopes, token_scopes):
    """
    Authorizes actions by checking if the user's token contains the required permissions (scopes).
    """
    return set(required_scopes).issubset(set(token_scopes))

def check_api_key(api_key, required_scopes):
    """
    Authenticates an API key and potentially returns details about the API key, such as permissions or ownership.
    """
    return {'test_key': 'test_value'}

# Get the appropriate env variables
load_dotenv()

def token_required(f: callable) -> callable:
    """Decorator to enforce token-based authentication on routes.

    This decorator checks for a valid JWT token in the request headers,
    decodes it, and retrieves the associated user. If the token is missing
    or invalid, it returns an appropriate error response.

    :param f: The original function to wrap.
    :type f: callable

    :return: The wrapped function with user information if the token is valid.
    :rtype: callable
    """
    
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1]  # Get token part from 'Bearer <token>'
        
        if not token:
            # logger.warning("Missing token in request")
            return error_response(message='Token is missing!', code=403)

        try:
            data = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
            current_user = data.get('user_id')
            # logger.info(f"Token verified for user: {current_user}")
        except Exception as e:
            # logger.error(f"Error decoding token: {e}")
            return error_response(message='Token is invalid!', code=403)

        return f(current_user, *args, **kwargs)

    return decorator

def check_login() -> ApiResponse:
    """Checks if a user is logged in by verifying session data.

    This function checks the session for a logged-in user. If found,
    it returns a success response with the user's ID and username; 
    otherwise, it returns an error response.

    :return: Success response with the user data, error response otherwise.
    :rtype: tuple
    """
    if 'user.id' in session:
        user_id = session.get('user.id')
        username = session.get('username')  # !TODO! This isnt working properly - username doesnt get stored in the session
        # Returning both username and user_id in the response body
        body = {
            'user_id': user_id,
            'username': username
        }
        print(body)
        return success_response(message=f'User {username} is logged in.', body=body)
    
    return error_response(message='User is not logged in.', code=401)

def get_spotify_token() -> str | None:
    """Obtains an access token from the Spotify API using client credentials.

    This function sends a request to the Spotify token endpoint to retrieve
    an access token using the client ID and secret. It returns the token
    if the request is successful; otherwise, it returns None.

    :return: Access token if the request is successful, None otherwise.
    :rtype: str or None
    """
    
    credentials = f"{os.getenv('SPOTIFY_CLIENT_ID')}:{os.getenv('SPOTIFY_CLIENT_SECRET')}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    auth_response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        headers={
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    )

    if auth_response.status_code == 200:
        return auth_response.json().get('access_token')
    else:
        print(f"Failed to get token: {auth_response.status_code}, {auth_response.text}")
        return None
