# coding: utf-8

from __future__ import absolute_import, annotations # import annotations to defer evaluation of circularly imported Song, Playlist classes 
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from app.models.base_model_ import Model
from app.models.song import Song  # noqa: F401,E501
from app import util


class Artist(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, id: int=None, name: str=None, songs: List[Song]=None, followers: int=None, is_followed: bool=None, profile_picture: str=None):  # noqa: E501
        """Artist - a model defined in Swagger

        :param id: The id of this Artist.  # noqa: E501
        :type id: int
        :param name: The name of this Artist.  # noqa: E501
        :type name: str
        :param songs: The songs of this Artist.  # noqa: E501
        :type songs: List[Song]
        :param followers: The followers of this Artist.  # noqa: E501
        :type followers: int
        :param is_followed: The is_followed of this Artist.  # noqa: E501
        :type is_followed: bool
        :param profile_picture: The profile picture of this Artist.  # noqa: E501
        :type profile_picture: str
        """
        self.swagger_types = {
            'id': int,
            'name': str,
            'songs': List[Song],  
            'followers': int,
            'is_followed': bool,
            'profile_picture': str
        }

        self.attribute_map = {
            'id': 'id',
            'name': 'name',
            'songs': 'songs',
            'followers': 'followers',
            'is_followed': 'is_followed',
            'profile_picture': 'profile_picture'
        }
        self._id = id
        self._name = name
        self._songs = songs
        self._followers = followers
        self._is_followed = is_followed
        self._profile_picture = profile_picture

    @classmethod
    def from_dict(cls, dikt) -> 'Artist':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Artist of this Artist.  # noqa: E501
        :rtype: Artist
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this Artist.

        Unique identifier for the artist  # noqa: E501

        :return: The id of this Artist.
        :rtype: int
        """
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this Artist.

        Unique identifier for the artist  # noqa: E501

        :param id: The id of this Artist.
        :type id: int
        """

        self._id = id

    @property
    def name(self) -> str:
        """Gets the name of this Artist.

        Name of the artist or band  # noqa: E501

        :return: The name of this Artist.
        :rtype: str
        """
        return self._name

    @name.setter
    def name(self, name: str):
        """Sets the name of this Artist.

        Name of the artist or band  # noqa: E501

        :param name: The name of this Artist.
        :type name: str
        """

        self._name = name

    @property
    def songs(self) -> List[Song]:     
        """Gets the songs of this Artist.

        List of Song objects that belong to the artist  # noqa: E501

        :return: The songs of this Artist.
        :rtype: List[Song]
        """
        return self._songs

    @songs.setter
    def songs(self, songs: List[Song]):  
        """Sets the songs of this Artist.

        List of Song objects that belong to the artist  # noqa: E501

        :param songs: The songs of this Artist.
        :type songs: List[Song]
        """

        self._songs = songs

    @property
    def followers(self) -> int:
        """Gets the followers of this Artist.

        Number of followers of the artist  # noqa: E501

        :return: The followers of this Artist.
        :rtype: int
        """
        return self._followers

    @followers.setter
    def followers(self, followers: int):
        """Sets the followers of this Artist.

        Number of followers of the artist  # noqa: E501

        :param followers: The followers of this Artist.
        :type followers: int
        """

        self._followers = followers

    @property
    def is_followed(self) -> bool:
        """Gets the is_followed of this Artist.

        Flag indicating if the user follows the artist  # noqa: E501

        :return: The is_followed of this Artist.
        :rtype: bool
        """
        return self._is_followed

    @is_followed.setter
    def is_followed(self, is_followed: bool):
        """Sets the is_followed of this Artist.

        Flag indicating if the user follows the artist  # noqa: E501

        :param is_followed: The is_followed of this Artist.
        :type is_followed: bool
        """

        self._is_followed = is_followed

    @property
    def profile_picture(self) -> str:
        """Gets the profile_picture of this Artist.

        Flag indicating if the user follows the artist  # noqa: E501

        :return: The profile_picture of this Artist.
        :rtype: bool
        """
        return self._profile_picture

    @profile_picture.setter
    def profile_picture(self, profile_picture: bool):
        """Sets the profile_picture of this Artist.

        Flag indicating if the user follows the artist  # noqa: E501

        :param profile_picture: The profile_picture of this Artist.
        :type profile_picture: bool
        """

        self._profile_picture = profile_picture
