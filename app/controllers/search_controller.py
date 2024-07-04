import connexion
import six

from app.models.search_result import SearchResult  # noqa: E501
from swagger_server import util


def search_artists_get(q):  # noqa: E501
    """Search for artists

    Retrieve search results for artists based on query # noqa: E501

    :param q: Search query string for artists
    :type q: str

    :rtype: SearchResult
    """
    return 'do some magic!'


def search_songs_get(q):  # noqa: E501
    """Search for songs

    Retrieve search results for songs based on query # noqa: E501

    :param q: Search query string for songs
    :type q: str

    :rtype: SearchResult
    """
    return 'do some magic!'
