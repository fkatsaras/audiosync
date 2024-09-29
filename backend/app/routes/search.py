from flask import Blueprint, request, jsonify
from app.controllers.authorization_controller import token_required
from app.controllers.search_controller import search_artists_get, search_songs_get

search_bp = Blueprint('search', __name__)

@search_bp.route('/search')
@token_required
def search_route(current_user):
    query = request.args.get('q') # Get the search query
    search_type = request.args.get('type')   # Get the search type (artists or songs)

    if not query:
        return jsonify({'error': 'Query parameter is required.'}), 400
    
    if search_type == 'artists':
        result = search_artists_get('query')
    elif search_type == 'songs':
        result = search_songs_get('query')
    else:
        return jsonify({'error': 'Invalid search type, must be "artists" or "songs"'}), 400
    
    return jsonify(result)