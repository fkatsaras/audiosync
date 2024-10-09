import re

from app.controllers.api_controller import *
from app.controllers.artists_controller import get_artist_profile_picture
from app.controllers.songs_controller import get_album_cover
from app.database import *

def search_artists_get(user_id: str = None, user_query: str = None, limit: int=5, offset: int=0) -> ApiResponse:  # noqa: E501           !TODO! Think about refactoring the whole songs/artists to avoid duplicate code# !TODO! refactor this with async so that we can get BATCH covers/ pfps in parallel from spotify
    """Search for artists

    Retrieve search results for artists based on query # noqa: E501

    :param user_query: Search query string for artists
    :type user_query: str

    :rtype: ApiResponse
    """
    # Handle user query
    try:
        if not user_query or not user_query.strip():
            # No query provided
            return error_response(
                message='Search query is empty.',
                code=400
            )
        
        user_query = user_query.strip()               # Removve leading / trailing whitespace
        user_query = re.sub(r'\s+', ' ', user_query)  # Recplace multiple spaces with a single space
        user_query = re.escape(user_query)            # Escape any special characters
        
        # Create DB connection
        connection = create_connection()
        if not connection:
            return error_response(
                message='DB connection failed.',
                code=500
            )
        
        # Query the database to find artists with matching names
        search_query = """
            SELECT id, name
            FROM artists
            WHERE LOWER(name) LIKE %s
            LIMIT %s OFFSET %s
        """

        query_param = f'%{user_query.lower()}%'  # Using wildcard for finding partial matches
        result = execute_query(connection=connection, query=search_query, values=(query_param, limit, offset))

        # If no artists found, return error response
        if not result:
            return error_response(
                message=f'No artists found for query {user_query} submitted by user: {user_id}',
                code=404
            )
        
        # Add profile picture for each artist
        artists = []
        for artist in result:               # !TODO! Add top result functionality sometime in the future: the album cover load takes a huge toll on performance
            artist_data = {
                'id': artist['id'],
                'name': artist['name'],
                'profile_picture': get_artist_profile_picture(artist['name'])
            }
            artists.append(artist_data)

        return success_response(
            message=f'Artists successfully found by user {user_id}',
            body={
                'artists' : artists
            }
        )   
    except Exception as e:
        return error_response(
            message=f'An error occurred: {str(e)}',
            code=500
        )


def search_songs_get(user_id: str=None, user_query: str=None, limit: int=5, offset: int=0) -> ApiResponse:  # noqa: E501LI
    """Search for songs

    Retrieve search results for songs based on query # noqa: E501

    :param user_query: Search query string for songs
    :type user_query: str

    :rtype: ApiResponse
    """

    # Handle user query
    try:
        if not user_query or not user_query.strip():
            # No query provided
            return error_response(
                message='Search query is empty.',
                code=400
            )
        
        user_query = user_query.strip()               # Removve leading / trailing whitespace
        user_query = re.sub(r'\s+', ' ', user_query)  # Recplace multiple spaces with a single space
        user_query = re.escape(user_query)            # Escape any special characters
        
        # Create DB connection
        connection = create_connection()
        if not connection:
            return error_response(
                message='DB connection failed.',
                code=500
            )
        
        # Query the database to find songs with matching titles
        search_query = """
            SELECT id, title, album, duration
            FROM songs
            WHERE LOWER(title) LIKE %s
            LIMIT %s OFFSET %s
        """

        query_param = f'%{user_query.lower()}%'  # Using wildcard for finding partial matches
        result = execute_query(connection=connection, query=search_query, values=(query_param, limit, offset))

        # If no songs found, return error response
        if not result:
            return error_response(
                message=f'No songs found for query {user_query} submitted by user: {user_id}',
                code=404
            )
        
        songs = []
        for song in result:
            song_data = {
                'id': song['id'],
                'title': song['title'],
                'duration': song['duration'],
                'album': get_album_cover(song['album']) 
            }
            songs.append(song_data)

        return success_response(
            message=f'Songs successfully found by user {user_id}',
            body={
                'songs' : songs
            }
        )   
    except Exception as e:
        return error_response(
            message=f'An error occurred: {str(e)}',
            code=500
        )