from flask import Blueprint, jsonify
from app.models.home_page_response import HomePageResponse, HomePageResponseLinks

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def index():
    # Create an instance of HomePageResponseLinks with some dummy data
    links_data = HomePageResponseLinks(
        liked_songs='/liked_songs',
        recommended='/recommended',
        my_artists='my_artists',
        search='/search',
        my_playlists='/my_playlists'
    )

    # Create an instance of HomePageResponse using the links data
    response_data = HomePageResponse(links=links_data)

    # Convert the response_data to a dictionary and jsonify it
    return jsonify(response_data.to_dict())