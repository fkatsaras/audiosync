import connexion
import six

from app.models.artist import Artist  # noqa: E501
from app.models.playlist import Playlist  # noqa: E501
from app.models.song import Song  # noqa: E501
from app import util


def add_liked_song(body, user_id):  # noqa: E501
    """User likes a song

    Add a new song to the list of liked songs for a specific user # noqa: E501

    :param body: Song object to be added to liked songs
    :type body: dict | bytes
    :param user_id: ID of the user to add the liked song
    :type user_id: int

    :rtype: None
    """
    if connexion.request.is_json:
        body = Song.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def create_user_playlist(body, user_id):  # noqa: E501
    """Create a new playlist

    Create a new playlist for a specific user # noqa: E501

    :param body: Playlist object to be created
    :type body: dict | bytes
    :param user_id: ID of the user to create the playlist for
    :type user_id: int

    :rtype: Playlist
    """
    if connexion.request.is_json:
        body = Playlist.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def delete_playlist_by_id(user_id, playlist_id):  # noqa: E501
    """Delete a specific playlist

    Delete a specific playlist created by a user # noqa: E501

    :param user_id: ID of the user who owns the playlist
    :type user_id: int
    :param playlist_id: ID of the playlist to delete
    :type playlist_id: int

    :rtype: None
    """
    return 'do some magic!'


def delete_user_playlist(user_id, playlist_id):  # noqa: E501
    """Delete a user&#x27;s playlist

    Delete a specific playlist created by a user # noqa: E501

    :param user_id: ID of the user who owns the playlist to delete
    :type user_id: int
    :param playlist_id: ID of the playlist to delete
    :type playlist_id: int

    :rtype: None
    """
    return 'do some magic!'


def follow_artist(body, user_id):  # noqa: E501
    """Follow an artist

    Add an artist to the user&#x27;s followed artists # noqa: E501

    :param body: Artist object that needs to be followed
    :type body: dict | bytes
    :param user_id: The ID of the user
    :type user_id: int

    :rtype: None
    """
    if connexion.request.is_json:
        body = Artist.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_liked_songs(user_id):  # noqa: E501
    """Get liked songs of a user

    Retrieve the list of songs liked by a specific user # noqa: E501

    :param user_id: ID of the user whose liked songs are to be fetched
    :type user_id: int

    :rtype: List[Song]
    """
    return 'do some magic!'


def get_playlist_by_id(user_id, playlist_id):  # noqa: E501
    """Get details of a specific playlist

    Retrieve details of a specific playlist created by a user # noqa: E501

    :param user_id: ID of the user who owns the playlist
    :type user_id: int
    :param playlist_id: ID of the playlist to fetch details for
    :type playlist_id: int

    :rtype: Playlist
    """
    return 'do some magic!'


def get_recommended_songs(user_id):  # noqa: E501
    """Get recommended songs for a user

    Retrieve recommended songs for a specific user based on their preferences # noqa: E501

    :param user_id: ID of the user to fetch recommended songs for
    :type user_id: int

    :rtype: List[Song]
    """
    return 'do some magic!'


def get_user_followed_artists(user_id):  # noqa: E501
    """Get followed artists

    Retrieve the list of artists followed by the user # noqa: E501

    :param user_id: The ID of the user
    :type user_id: int

    :rtype: List[Artist]
    """
    return 'do some magic!'


def get_user_playlists(user_id):  # noqa: E501
    """Get user&#x27;s playlists

    Retrieve the playlists created by a specific user # noqa: E501

    :param user_id: ID of the user whose playlists are to be fetched
    :type user_id: int

    :rtype: List[Playlist]
    """
    return 'do some magic!'


def login_user(username=None, password=None):  # noqa: E501
    """Logs user into the system

     # noqa: E501

    :param username: The user name for login
    :type username: str
    :param password: The password for login in clear text
    :type password: str

    :rtype: str
    """
    return 'do some magic!'


def logout_user():  # noqa: E501
    """Logs out current logged in user session

     # noqa: E501


    :rtype: None
    """
    return 'do some magic!'


def remove_liked_song(user_id, song_id):  # noqa: E501
    """User unlikes a song

    Remove a specific song from the list of liked songs for a user # noqa: E501

    :param user_id: ID of the user to remove the liked song from
    :type user_id: int
    :param song_id: ID of the song to be removed from liked songs
    :type song_id: int

    :rtype: None
    """
    return 'do some magic!'


def unfollow_artist(user_id, artist_id):  # noqa: E501
    """Unfollow an artist

    Remove an artist from the user&#x27;s followed artists # noqa: E501

    :param user_id: The ID of the user
    :type user_id: int
    :param artist_id: The ID of the artist to unfollow
    :type artist_id: int

    :rtype: None
    """
    return 'do some magic!'


def update_playlist_by_id(body, user_id, playlist_id):  # noqa: E501
    """Update details of a specific playlist

    Update details of a specific playlist owned by a user # noqa: E501

    :param body: Updated playlist object
    :type body: dict | bytes
    :param user_id: ID of the user who owns the playlist
    :type user_id: int
    :param playlist_id: ID of the playlist to update
    :type playlist_id: int

    :rtype: None
    """
    if connexion.request.is_json:
        body = Playlist.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'