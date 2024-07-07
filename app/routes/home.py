from flask import Blueprint, render_template
from app.models.home_page_response import HomePageResponse
from app.models.home_page_response_links import HomePageResponseLinks

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def index():

    BASE_URL = "http://localhost:8080"
    # Create an instance of HomePageResponseLinks with some dummy data
    links_data = HomePageResponseLinks(
        liked_songs=f'{BASE_URL}/liked_songs',
        recommended=f'{BASE_URL}/recommended',
        my_artists=f'{BASE_URL}/my_artists',
        search=f'{BASE_URL}/search',
        my_playlists=f'{BASE_URL}/my_playlists'
    )

    # Create an instance of HomePageResponse using the links data
    response_data = HomePageResponse(links=links_data)

    # Convert the response_data to a dictionary and jsonify it
    return render_template('home.html', links_data=response_data.to_dict())