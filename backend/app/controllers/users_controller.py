import connexion
import jwt
import six

from app.models.artist import Artist  # noqa: E501
from app.models.playlist import Playlist  # noqa: E501
from app.models.song import Song  # noqa: E501
from app.models.user_entity import UserEntity
from app.utils.logging_config import get_logger
from app.controllers.api_controller import *
from app.models.api_response import ApiResponse

from app.controllers.authorization_controller import JWT_SECRET_KEY

from werkzeug.security import check_password_hash, generate_password_hash
import datetime
from flask import request, jsonify, session
from app.utils.sample_data import user      # TEST : In-memory user store for demonstration --- Use a db in the future

from app.database import *

logger = get_logger(__name__)


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

def register_user():    # noqa: E501
    """
    Registers a new user in the system by creating a new record in the database.

    The function performs the following steps:

    1. Extracts JSON data (username, password, email, first name, last name) from the POST request.
    2. Validates that the required fields (username, password, email) are provided.
    3. Hashes the user's password for secure storage.
    4. Establishes a database connection to insert the new user's data.
    5. Executes an SQL `INSERT` statement to store the new user in the database.
    6. Handles duplicate username errors (if the username already exists) and provides an appropriate error response.
    7. Commits the transaction to persist the new user in the database.
    8. Returns a success response if the registration is successful, or an error response in case of failure.

    :returns: A JSON response with success or error information.
    :rtype: Response (Flask jsonify)
    """
    data = request.get_json()

    # Extracting the required fields from the request
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    # Validate required fields
    if not username or not password or not email:
        return create_error_response(message='Missing required fields for registration', code=400)
    
    # Hash the password
    password_hash = generate_password_hash(password=password)

    # Establish a db connection
    connection = create_connection()

    if connection is None:
        return create_error_response(message='Database connection failed', code=500)
    
    # Execute query from the stored procedure to load new data into DB
    try:
        cursor = connection.cursor()

        # Call the procedure REGISTER_USER in the DB
        execute_query(
            connection=connection,
            query="CALL register_user(%s, %s, %s, %s, %s, @p_success, @p_message);",
            values=(username, password_hash, email, first_name, last_name),
        )

        # Get the results back
        output_result = execute_query(
            connection=connection,
            query="SELECT @p_success, @p_message;"
        )

        # Use the output parameters if they exist
        if output_result:
            p_success, p_message = output_result[0]  # Unpack the first row of the result

        if p_success == 1:
            return create_success_response(message=p_message, code=201)
        else:
            return create_error_response(message=p_message, code=400)
    except Exception as e:
        connection.rollback()
        return create_error_response(message=f'Error registering user: {str(e)}', code=500)
    finally:
        # Close the connection
        cursor.close()
        close_connection(connection=connection)

def login_user():  # noqa: E501
    """
    Logs a user into the system by validating credentials, generating a JWT token, 
    and storing the user ID in the session.

    The function performs the following steps:
    
    1. Extracts JSON data (username and password) from the POST request.
    2. Validates that both username and password are provided.
    3. Logs a login attempt for the provided username.
    4. Establishes a connection to the database.
    5. Queries the database for the password hash corresponding to the provided username.
    6. Validates the provided password against the stored password hash using a secure hashing function.
    7. If authentication is successful:
        - Generates a JWT token with the username and a 1-hour expiration time.
        - Stores the username in the session for tracking the logged-in user.
        - Returns a success response with the generated JWT token.
    8. If authentication fails (invalid credentials or user not found):
        - Returns an error response indicating invalid credentials.
    
    :returns: A JSON response with a JWT token if login is successful, or an error response otherwise.
    :rtype: Response (Flask jsonify)
    """

    # Extract JSON data from the POST request
    data = request.get_json()

    # Validate query parameters
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        logger.error("Username or password not provided")
        return create_error_response(
            message='Username or password missing',
            code=400
        )

    logger.info(f"Login attempt - Username: {username}")

    # Establish a DB connection
    connection = create_connection()

    if connection is None:
        return create_error_response(message='DB connection failed', code=500)
    
    # Query the DB for the users password hash
    query = """
        SELECT password_hash FROM users WHERE username = %s
    """
    result = execute_query(connection, query, (username,)) # Comma is necessary to make the value a Tuple

    if result is None or len(result) == 0:
        logger.error("User not found")
        return create_error_response(message='Invalid credentials', code=401)
    
    stored_password_hash = result[0][0]  # Get the password hash from the first row

    # # Check credentials against in-memory user store
    # stored_password_hash = user.get(username) # FIX This checks against a test user defined here - In the future use a db for storing user data
    
    if stored_password_hash and check_password_hash(stored_password_hash, password):
        logger.debug("Credentials are valid")
        
        # Generate a JWT token
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, JWT_SECRET_KEY, algorithm="HS256")

        # Store user ID in session
        session['user.id'] = username
        logger.debug(f"Session user ID set to: {session.get('user.id')}")
        logger.debug(f"Generated token: {token}")
        
        # Return the token as a JSON response using the api model
        success_response = ApiResponse(
            code=200,
            type='success',
            message='Login successful'
        )
        return jsonify({
            **success_response.to_dict(),
            'token': token
        }), 200
    
    else:
        logger.error("Invalid credentials")

        return create_error_response(
            message='Invalid credentials',
            code=401
        )


def logout_user():  # noqa: E501
    """Logs out the current logged-in user session

    :rtype: Response
    """
    data = request.get_json()
    
    username = data.get('username')
    if username:
        logger.info(f"User {username} logged out")
        
        # Clear the username from the session
        session.pop('username', None)
        
        # Create a successful response
        return create_success_response(
            message='Logged out successfully!'
        )
    else:
        logger.warning("Logout attempted with no active session")
        
        # Create a response indicating no user was logged in
        return create_error_response(
            message='No active session found',
            code=400
        )


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
