from flask import Blueprint, request, jsonify
from app.controllers.authorization_controller import token_required
from app.controllers.search_controller import search_artists_get, search_songs_get

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/artists', methods=['GET'])
@token_required
def search_artists_route(current_user):
    query = request.args.get('q')

    if not query:
        return jsonify({'error': 'Query parameter is required.'}), 400
    
    return search_artists_get(query)  
     

@search_bp.route('/search/songs', methods=['GET'])
@token_required
def search_songs_route(current_user):
    query = request.args.get('q')  

    if not query:
        return jsonify({'error': 'Query parameter is required.'}), 400
    
    return search_songs_get(query) 
    