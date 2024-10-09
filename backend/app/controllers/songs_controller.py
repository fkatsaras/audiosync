import connexion
import six

from flask import jsonify
import requests

from app.models.inline_response200 import InlineResponse200  # noqa: E501
from app.models.song import Song  # noqa: E501
from app.utils import sample_data
from app.controllers.api_controller import *
from app.controllers.authorization_controller import get_spotify_token

from app.database import *

def get_album_cover(album_name: str) -> str | None:  # noqa: E501
    """Get album cover by album name

    Retrieve the album cover image URL for a given album by searching on Spotify. # noqa: E501

    :param album_name: The name of the album to search for
    :type album_name: str

    :return: The URL of the album cover image or None if not found
    :rtype: str or None
    """
    token = get_spotify_token()
    search_url = f'https://api.spotify.com/v1/search?q={album_name}&type=album'
    
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(search_url, headers=headers)
    albums = response.json().get('albums', {}).get('items', [])
    
    if albums:
        return albums[0]['images'][0]['url']  # Get the largest image
    else:
        return None


def get_song_by_id(user_id: int, song_id: int, as_response: bool=True) -> Song | ApiResponse:  # noqa: E501
    """Get song by ID

    Retrieve information about a specific song from the database # noqa: E501

    :param song_id: The ID of the song to fetch
    :type song_id: int
    :param user_id: The ID of the user liking the song
    :type user_id: int
    :param as_response: A flag to indicate wether the function will return a JSON/Dict or an Object
    :type as_response: bool

    :rtype: Song | ApiResponse
    """

    # Create DB connection
    connection = create_connection()
    if not connection:
        return error_response(
            message='DB connection failed.',
            code=500
        )

    query = """
    SELECT songs.*, artists.name AS artist_name
    FROM songs
    JOIN artists ON songs.artist_id = artists.id
    WHERE songs.id = %s
    """                                  # !TODO! Create another store procedure for this
    values = (song_id,)

    # Execute the query and retrieve the song data as a dictionary
    result = execute_query(connection=connection, query=query, values=values)    # !TODO! Might need to add this to database.py (return ApiResponse)

    if result and len(result) > 0:
        song_data = result[0]  # Retrieve the first result (since we expect a single song by ID)

        # Append the artists name to the song data
        song_data['artist'] = song_data.get('artist_name')
        
        # Create a Song object using the from_dict method
        song = Song.from_dict(song_data)

        # Fetch the album cover using the song's album name and set it as the cover of the song instance
        album_cover_url = get_album_cover(song.album)
        song.cover = album_cover_url

        # Check if the user has liked this song
        like_query = """
            SELECT 1 FROM liked_songs
            WHERE user_id = %s AND song_id = %s
        """
        like_result = execute_query(connection=connection, query=like_query, values=(user_id, song_id))
        song.liked = bool(like_result)  # Set the `is_liked` attribute based on query result

        # Create a successful API response with the song data in the body 
        return success_response(
            message='Song retrieved successfully',
            body=song.to_dict()
        )
    else:
        # Create an error response
        return error_response(
            message=f'Song with ID: {song_id} not found.',
            code=404
        )


def get_song_play_status(song_id):  # noqa: E501
    """Get play status of a song

    Retrieve the current play status (playing or paused) of a specific song # noqa: E501

    :param song_id: ID of the song to retrieve play status for
    :type song_id: int

    :rtype: InlineResponse200
    """
    return 'do some magic!'


def toggle_song_playback(song_id):  # noqa: E501
    """Toggle play/pause of a song

    Start or pause playback of a specific song # noqa: E501

    :param song_id: ID of the song to toggle play/pause
    :type song_id: int

    :rtype: None
    """
    return 'do some magic!'
