from flask import request, jsonify, session, redirect, url_for, flash, render_template
from app.models.home_page_response_links import HomePageResponseLinks

def home():  # noqa: E501
    """Get Home Page GUI

    Retrieve the home page GUI data # noqa: E501


    :rtype: HomePageResponse
    """
    if 'user.id' not in session:
        return redirect(url_for('landing.landing'))

    links = HomePageResponseLinks(
        liked_songs='/liked-songs',
        recommended='/recommended',
        my_artists='/my-artists',
        search='/search',
        my_playlists='/my-playlists'
    )

    return render_template('home.html', links=links)
