from flask import request, jsonify, session, redirect, url_for, flash, render_template
from app.models.home_page_response_links import HomePageResponseLinks

def home(current_user):  # Accept `current_user` argument
    """Get Home Page GUI

    Retrieve the home page GUI data
    :param current_user: The username extracted from the token
    :rtype: HomePageResponse
    """
    if not current_user:
        return redirect(url_for('landing.landing_route'))

    links = {
        'liked_songs': '/liked-songs',
        'recommended': '/recommended',
        'my_artists': '/my-artists',
        'search': '/search',
        'my_playlists': '/my-playlists'
    }

    return jsonify({'links': links})
