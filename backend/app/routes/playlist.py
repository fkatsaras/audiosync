from flask import Blueprint
from app.controllers.playlists_controller import *
from app.controllers.authorization_controller import token_required

playlist_bp = Blueprint('playlist', __name__)

@playlist_bp.route('/api/v1/playlists/<int:playlist_id>', methods=['GET'])
@token_required
def playlist_route(current_user: int, playlist_id: int) -> ApiResponse:
    """
    Route to get information about a playlist
    """
    return get_playlist_by_id(user_id=current_user, playlist_id=playlist_id)

@playlist_bp.route('/api/v1/users/my-playlists', methods=['GET'])
@token_required
def get_users_playlists_route(current_user: int) -> ApiResponse:
    """
    Route to get a users created playlists
    """
    return get_users_playlists(user_id=current_user)