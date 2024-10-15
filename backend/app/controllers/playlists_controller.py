import connexion
import six

from app.controllers.authorization_controller import *
from app.controllers.api_controller import *
from app.models import Playlist
from app.database import *

def get_playlist_by_id(user_id: int, playlist_id: int, as_response: bool=True ) -> ApiResponse:
    """
    Get a Playlist by its ID

    Retrieve information about a specific playlist from the database # noqa: E501

    :param playlist_id: The ID of the playlist to fetch
    :type playlist_id: int
    :param user_id: The ID of the user liking the playlist
    :type user_id: int
    :param as_response: A flag to indicate wether the function will return a JSON/Dict or an Object
    :type as_response: bool

    :rtype: Playlist | ApiResponse
    """

    try:
        # Create DB connection
        connection = create_connection()
        if not connection:
            return error_response(
                message='DB connection failed.',
                code=500
            )
        
        query = """
        SELECT playlists.*, songs.id AS song_id, songs.title AS song_title, songs.artist_id, artists.name AS artists_name
        FROM playlists
        JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        JOIN songs ON playlist_songs.song_id = songs.id
        JOIN artists ON songs.artist_id = artists.id
        WHERE playlists.id = %s
        """  # !TODO! Create another stored procedure for this

        values = (playlist_id,)

        # Retrieve data from the DB in Dict/JSON
        result = execute_query(connection=connection, query=query, values=values)

        if result and len(result) > 0:
            # Extract playlist data from the result 
            playlist_data = {
                'id': result[0]['id'],
                'name': result[0]['name'],
                'description': result[0]['description'],
                'cover': result[0]['cover'],
                'created_at': result[0]['created_at'],
                'updated_at': result[0]['updated_at'],
                'songs': []
            }

            for row in result:
                song = {
                    'id' : row['song_id'],
                    'title' : row['song_title'],
                    'artist' : row['artist_name']
                }
                playlist_data['songs'].append(song)

            # !TODO! Check if user has liked this playlist

            if as_response:
                return success_response(
                    message='Playlist retrieved successfully.',
                    body=playlist_data
                )
            else:
                # Create and return Playlist Object
                return Playlist.from_dict(playlist_data)
    except Exception as e:
        return error_response(
            message=f'An error occurred while retrieving the playlist: {str(e)}',
            code=500
        )
    
def get_users_playlists(user_id: int, as_response: bool=True) -> ApiResponse:
    """
    Get all playlists created by a user

    Retrieve basic information about all playlists created by the user # noqa: E501

    :param user_id: The ID of the user whose playlists are being retrieved
    :type user_id: int
    :param as_response: A flag to indicate whether the function will return a JSON/Dict or an Object
    :type as_response: bool

    :rtype: List[Playlist] | ApiResponse
    """ 

    try:
        # Create DB connection
        connection = create_connection()
        if not connection:
            return error_response(
                message='DB connection failed.',
                code=500
            )
        
        query = """
        SELECT id, title, created_at, updated_at
        FROM playlists
        WHERE owner = %s
        """

        result = execute_query(connection=connection, query=query, values=(user_id, ))

        if result and len(result) > 0:

            if as_response:
                return success_response(
                    message='Playlists retrieved successfully.',
                    body=result
                )
            else: 
                return [Playlist.from_dict(row) for row in result]
            
        else: 
            return error_response(
                message='No playlists found for this user.',
                code=404
            )
        
    except Exception as e:
        return error_response(
            message=f'An error occurred while retrieving the playlists for user {user_id}: {str(e)}',
            code=500
        )
