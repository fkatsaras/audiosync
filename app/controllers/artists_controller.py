import connexion
import six

from app.models.artist import Artist  # noqa: E501
from app.models.song import Song  # noqa: E501
from app import util


def get_artist_songs(artist_id):  # noqa: E501
    """Get artist songs

    Retrieve the list of songs by a specific artist # noqa: E501

    :param artist_id: The ID of the artist
    :type artist_id: int

    :rtype: List[Song]
    """
    return 'do some magic!'


def gett_artist_by_id(artist_id):  # noqa: E501
    """Get artist by id

    Retrieve information about a specific artist # noqa: E501

    :param artist_id: The ID of the artist to fetch
    :type artist_id: int

    :rtype: Artist
    """
    return 'do some magic!'
