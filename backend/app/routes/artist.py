from flask import Blueprint
from app.controllers.artists_controller import *
from app.controllers.authorization_controller import token_required

artist_bp = Blueprint('artist', __name__)

@artist_bp.route('/api/v1/artists/<int:artist_id>', methods=['GET'])
@token_required
def artist_route(current_user, artist_id):
    """Route to get artist information by artist_id"""
    return get_artist_by_id(artist_id=artist_id)
