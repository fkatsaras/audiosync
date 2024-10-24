from flask import Blueprint, redirect
from app.controllers.authorization_controller import *
from app.controllers.api_controller import *
from app.controllers.users_controller import login_user, logout_user, register_user

load_dotenv()

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/v1/users/check-login', methods=['GET'])
def check_login_route():
    return check_login()

@auth_bp.route('/api/v1/users/register', methods=['POST'])
def register_route():
    return register_user()

@auth_bp.route('/api/v1/users/login', methods=['POST'])
def login_route():
    return login_user()

@auth_bp.route('/api/v1/users/logout', methods=['POST']) 
def logout_route():
    return logout_user()

@auth_bp.route('/api/v1/spotify/login', methods=['GET'])
def spotify_login_route():
    """
    Route for managing access to Spotify's Player
    """
    scope = "user-read-playback-state user-modify-playback-state"
    auth_url = f"https://accounts.spotify.com/authorize?response_type=code&client_id={os.getenv('SPOTIFY_CLIENT_ID')}&scope={scope}&redirect_uri={os.getenv('SPOTIFY_REDIRECT_URI')}"
    return success_response(message='Fetched Spotify Auth URL', body={'auth_url' : auth_url})

@auth_bp.route('/api/v1/spotify/callback', methods=['GET'])
def spotify_callback_route():
    """
    Route to fetch access token to Spotify;s Player
    """
    return spotify_callback()