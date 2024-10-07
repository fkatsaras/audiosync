from flask import Blueprint
from app.controllers.artists_controller import *
from app.controllers.authorization_controller import token_required

artist_bp = Blueprint('artist', __name__)

@artist_bp.route('/api/v1/artists/<int:artist_id>', methods=['GET'])
@token_required
def artist_route(current_user, artist_id):
    """Route to get artist information by artist_id"""
    return get_artist_by_id(artist_id=artist_id)

@artist_bp.route('/api/v1/artists/<int:artist_id>/follow', methods=['POST'])
@token_required
def follow_artist_route(current_user, artist_id):
    """Route to update the artis's is_followed variable"""
    return follow_artist(artist_id=artist_id)