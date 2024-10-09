from flask import Blueprint, request, jsonify
from app.controllers.api_controller import *
from app.controllers.authorization_controller import token_required
from app.controllers.search_controller import search_artists_get, search_songs_get

search_bp = Blueprint('search', __name__)

@search_bp.route('/api/v1/search/artists', methods=['GET'])
@token_required
def search_artists_route(current_user: int) -> ApiResponse:
    query = request.args.get('q')
    
    return search_artists_get(user_id=current_user, user_query=query)  
     

@search_bp.route('/api/v1/search/songs', methods=['GET'])
@token_required
def search_songs_route(current_user: int) -> ApiResponse:
    query = request.args.get('q')  
    
    return search_songs_get(user_id=current_user, user_query=query) 
    