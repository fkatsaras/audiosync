from flask import jsonify
from app.models.api_response import ApiResponse

def home(current_user):
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

    # Include the links in the body of the ApiResponse
    response = ApiResponse(
        code=200, 
        type='success', 
        message=f'Home page links retrieved successfully for user: {current_user}.', 
        body=links 
    )

    return jsonify(response.to_dict()), 200