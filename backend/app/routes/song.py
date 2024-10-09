from flask import Blueprint
from app.controllers.songs_controller import *
from app.controllers.users_controller import toggle_like_song
from app.controllers.authorization_controller import token_required

song_bp = Blueprint('song', __name__)

@song_bp.route('/api/v1/songs/<int:song_id>', methods=['GET'])
@token_required
def song_route(current_user, song_id):
    """Route to get song information by song_id"""
    return get_song_by_id(user_id=current_user, song_id=song_id)

@song_bp.route('/api/v1/songs/<int:song_id>/like', methods=['POST'])
@token_required
def toggle_like_song_route(current_user: int, song_id: int) -> ApiResponse:
    """Route to set /unset a song as liked for a given user"""
    return toggle_like_song(user_id=current_user, song_id=song_id)