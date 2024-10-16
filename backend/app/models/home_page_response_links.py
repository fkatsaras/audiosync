# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from app.models.base_model_ import Model
from app import util


class HomePageResponseLinks(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, liked_songs: str=None, recommended: str=None, my_artists: str=None, search: str=None, my_playlists: str=None):  # noqa: E501
        """HomePageResponseLinks - a model defined in Swagger

        :param liked_songs: The liked_songs of this HomePageResponseLinks.  # noqa: E501
        :type liked_songs: str
        :param recommended: The recommended of this HomePageResponseLinks.  # noqa: E501
        :type recommended: str
        :param my_artists: The my_artists of this HomePageResponseLinks.  # noqa: E501
        :type my_artists: str
        :param search: The search of this HomePageResponseLinks.  # noqa: E501
        :type search: str
        :param my_playlists: The my_playlists of this HomePageResponseLinks.  # noqa: E501
        :type my_playlists: str
        """
        self.swagger_types = {
            'liked_songs': str,
            'recommended': str,
            'my_artists': str,
            'search': str,
            'my_playlists': str
        }

        self.attribute_map = {
            'liked_songs': 'likedSongs',
            'recommended': 'recommended',
            'my_artists': 'myArtists',
            'search': 'search',
            'my_playlists': 'myPlaylists'
        }
        self._liked_songs = liked_songs
        self._recommended = recommended
        self._my_artists = my_artists
        self._search = search
        self._my_playlists = my_playlists

    @classmethod
    def from_dict(cls, dikt) -> 'HomePageResponseLinks':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The HomePageResponse_links of this HomePageResponseLinks.  # noqa: E501
        :rtype: HomePageResponseLinks
        """
        return util.deserialize_model(dikt, cls)

    @property
    def liked_songs(self) -> str:
        """Gets the liked_songs of this HomePageResponseLinks.

        URL to navigate to the liked songs page of the user  # noqa: E501

        :return: The liked_songs of this HomePageResponseLinks.
        :rtype: str
        """
        return self._liked_songs

    @liked_songs.setter
    def liked_songs(self, liked_songs: str):
        """Sets the liked_songs of this HomePageResponseLinks.

        URL to navigate to the liked songs page of the user  # noqa: E501

        :param liked_songs: The liked_songs of this HomePageResponseLinks.
        :type liked_songs: str
        """

        self._liked_songs = liked_songs

    @property
    def recommended(self) -> str:
        """Gets the recommended of this HomePageResponseLinks.

        URL to navigate to the recommended songs page of the user  # noqa: E501

        :return: The recommended of this HomePageResponseLinks.
        :rtype: str
        """
        return self._recommended

    @recommended.setter
    def recommended(self, recommended: str):
        """Sets the recommended of this HomePageResponseLinks.

        URL to navigate to the recommended songs page of the user  # noqa: E501

        :param recommended: The recommended of this HomePageResponseLinks.
        :type recommended: str
        """

        self._recommended = recommended

    @property
    def my_artists(self) -> str:
        """Gets the my_artists of this HomePageResponseLinks.

        URL to navigate to the followed artists page of the user  # noqa: E501

        :return: The my_artists of this HomePageResponseLinks.
        :rtype: str
        """
        return self._my_artists

    @my_artists.setter
    def my_artists(self, my_artists: str):
        """Sets the my_artists of this HomePageResponseLinks.

        URL to navigate to the followed artists page of the user  # noqa: E501

        :param my_artists: The my_artists of this HomePageResponseLinks.
        :type my_artists: str
        """

        self._my_artists = my_artists

    @property
    def search(self) -> str:
        """Gets the search of this HomePageResponseLinks.

        URL to navigate to the search page  # noqa: E501

        :return: The search of this HomePageResponseLinks.
        :rtype: str
        """
        return self._search

    @search.setter
    def search(self, search: str):
        """Sets the search of this HomePageResponseLinks.

        URL to navigate to the search page  # noqa: E501

        :param search: The search of this HomePageResponseLinks.
        :type search: str
        """

        self._search = search

    @property
    def my_playlists(self) -> str:
        """Gets the my_playlists of this HomePageResponseLinks.

        URL to navigate to My Playlists page  # noqa: E501

        :return: The my_playlists of this HomePageResponseLinks.
        :rtype: str
        """
        return self._my_playlists

    @my_playlists.setter
    def my_playlists(self, my_playlists: str):
        """Sets the my_playlists of this HomePageResponseLinks.

        URL to navigate to My Playlists page  # noqa: E501

        :param my_playlists: The my_playlists of this HomePageResponseLinks.
        :type my_playlists: str
        """

        self._my_playlists = my_playlists
