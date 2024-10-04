from app.models.api_response import ApiResponse
from app.controllers.api_controller import *

def home(current_user: str) -> ApiResponse:
    """Get Home Page GUI

    Retrieve the home page GUI data
    :param current_user: The username extracted from the token
    :rtype: ApiResponse
    """
    
    links = {
        'liked_songs': '/liked-songs',
        'recommended': '/recommended',
        'my_artists': '/my-artists',
        'search': '/search',
        'my_playlists': '/my-playlists'
    }
    return create_success_response(
        message=f'Home page links retrieved successfully for user: {current_user}.',
        body=links
    )