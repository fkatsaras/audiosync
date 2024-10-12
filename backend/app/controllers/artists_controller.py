import connexion
import six
import requests

from app.models.artist import Artist  # noqa: E501
from app.models.song import Song  # noqa: E501
from app import util
from app.models.api_response import ApiResponse
from app.controllers.authorization_controller import get_spotify_token
from app.controllers.songs_controller import get_album_cover
from app.controllers.api_controller import *
from app.database import *

def get_artist_profile_picture(artist_name: str) -> str | None:  # noqa: E501
    """Get artist profile picture by artist name

    Retrieve the artist's profile picture URL for a given artist by searching on Spotify. # noqa: E501

    :param artist_name: The name of the artist to search for
    :type artist_name: str

    :return: The URL of the artist's profile picture or None if not found
    :rtype: str or None
    """
    token = get_spotify_token()
    search_url = f'https://api.spotify.com/v1/search?q={artist_name}&type=artist'
    
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(search_url, headers=headers)
    artists = response.json().get('artists', {}).get('items', [])
    
    if artists:
        return artists[0]['images'][0]['url']  # Get the largest image
    else:
        return None


def get_artist_songs(artist_id: int) -> ApiResponse:  # noqa: E501
    """Get artist songs

    Retrieve the list of songs by a specific artist # noqa: E501

    :param artist_id: The ID of the artist
    :type artist_id: int

    :rtype: List[Song]
    """
    return 'do some magic!'


def get_artist_by_id(user_id: int, artist_id: int, as_response: bool=True) -> ApiResponse | Artist:  # noqa: E501
    """Get artist by ID

    Retrieve information about a specific artist from the database # noqa: E501

    :param artist_id: The ID of the artist to fetch
    :type artist_id: int

    :rtype: ApiResponse
    """
    try:
        # Create DB connection
        connection = create_connection()
        if not connection:
            return error_response(
                message='DB connection failed.',
                code=500
            )

        # Step 1:  Fetch the artists details from the DB
        artist_id_query = "SELECT * FROM artists WHERE id = %s"                                  # !TODO! Create another store procedure for this
        values = (artist_id,)

        result = execute_query(connection=connection, query=artist_id_query, values=values)      # !TODO! Might need to add this to database.py (return ApiResponse)

        if result and len(result) > 0:
            artist_data = result[0]  # Retrieve the first result (since we expect a single artist by ID)

            # Step 2: Fetch the songs related to the artist from the DB
            songs_query = "SELECT * FROM songs WHERE artist_id = %s"
            song_values = (artist_id,)
            songs_result = execute_query(connection=connection, query=songs_query, values=song_values)

            # Step 3: Create Song objs from query
            songs = []
            for song_data in songs_result:
                song = Song.from_dict(song_data)
                song.cover = get_album_cover(song.album)
                songs.append(song)

            # Step 4: Check if the user follows this artist
            follow_query = """
                SELECT 1 FROM followed_artists
                WHERE user_id = %s AND artist_id = %s
            """
            follow_result = execute_query(connection=connection, query=follow_query, values=(user_id, artist_id))

            is_followed = bool(follow_result)  # If there's a result, the user follows the artist

            # Step 5: Create Artist obj from data
            artist = Artist.from_dict(artist_data)
            artist.songs = songs # Assign the list of songs 
            artist.is_followed = is_followed # Assign the follow status for the user

            # Fetch the album cover using the song's album name and set it as the cover of the song instance
            pfp = get_artist_profile_picture(artist.name)
            artist.profile_picture = pfp

            if as_response:
                # Create a successful API response with the artist data in the body 
                return success_response(
                    message='Artist retrieved successfully',
                    body=artist.to_dict()
                )
            else: 
                return artist   #If specified, returns the artist as an Object
        else:
            # Create an error response
            return error_response(
                message=f'Artist with ID: {artist_id} not found.',
                code=404
            )
    except Exception as e:
        return error_response(
            message=f'An error occurred while retreiving the artist: {str(e)}',
            code=500
        )
    
def update_artist_db(connection: mysql.connector.connection.MySQLConnection, artist_id: int, updates: dict) -> bool:    #!TODO! Move that into the database utils / make it more modular
    """Update the artist's attributes in the database.

    :param connection: The MySQL connection object.
    :param artist_id: The ID of the artist to update.
    :param updates: A dictionary of field names and their new values.
    :return: True if the update was successful, False otherwise.
    """

    if not updates:
        print("No updates provided.")
        return False
    
    # Build SET clause dynamically given the inputs
    set_clause = ', '.join(f"{key} = %s" for key in updates.keys())

    # Prepare the SQL query
    query = f"""
    UPDATE artists
    SET {set_clause}
    WHERE id = %s;
    """

    # Prepare the values to be passed into the query
    values = list(updates.values()) + [artist_id]

    # Execute the update query
    result = execute_query(connection=connection, query=query, values=tuple(values))

    return result is not None
