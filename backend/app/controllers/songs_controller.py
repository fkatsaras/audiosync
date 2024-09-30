import connexion
import six

from flask import jsonify
import requests

from app.models.inline_response200 import InlineResponse200  # noqa: E501
from app.models.song import Song  # noqa: E501
from app.utils import sample_data
from app.models.api_response import ApiResponse
from app.controllers.authorization_controller import get_spotify_token

def get_album_cover(album_name):
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


def get_song_by_id(song_id):  # noqa: E501
    """Get song by ID

    Retrieve information about a specific song # noqa: E501

    :param song_id: The ID of the song to fetch
    :type song_id: int

    :rtype: Song
    """

    # Placeholder ! Add DB functionality here
    song = next((song for song in sample_data.songs_data if song.id == song_id), None)

    if song:

        # Fetch the album cover using the song's album name and set it as the cover of the song instance
        album_cover_url = get_album_cover(song.album)
        song.cover = album_cover_url

        # Create a successful API response with the song data in the body 
        response = ApiResponse(
            code=200,
            type='success',
            message='Song retrieved successfully.',
            body=song.to_dict()
        )
        return jsonify(response.to_dict()), 200
    else:
        # Create an error response
        response = ApiResponse(
            code=404,
            type='error',
            message=f'Song with ID: {song_id} not found.',
            body=None
        )
        return jsonify(response.to_dict()), 404


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
