from flask import Blueprint
from app.controllers.songs_controller import *
from app.controllers.authorization_controller import token_required

song_bp = Blueprint('song', __name__)

@song_bp.route('/api/v1/song/<int:song_id>', methods=['GET'])
@token_required
def song_route(current_user, song_id):
    """Route to get song information by song_id"""
    return get_song_by_id(song_id=song_id)

