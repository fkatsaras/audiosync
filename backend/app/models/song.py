# coding: utf-8

from __future__ import absolute_import, annotations
from datetime import date, datetime  # noqa: F401

from typing import List, Dict , TYPE_CHECKING # noqa: F401

from app.models.base_model_ import Model
from app.models.playlist import Playlist  # noqa: F401,E501
from app import util

if TYPE_CHECKING:
    from app.models.playlist import Playlist

class Song(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, id: int=None, title: str=None, artist_id: int=None, artist: str=None, album: str=None, duration: int=None, cover: str=None, liked: bool=None, playlists: List[Playlist]=None, is_playing: bool=None):  # noqa: E501 Forward reference to Playlist
        """Song - a model defined in Swagger

        :param id: The id of this Song.  # noqa: E501
        :type id: int
        :param title: The title of this Song.  # noqa: E501
        :type title: str
        :param artist: The id of the artist of this Song.  # noqa: E501
        :type artist: int
        :param artist: The artist of this Song.  # noqa: E501
        :type artist: str
        :param album: The album of this Song.  # noqa: E501
        :type album: str
        :param duration: The duration of this Song.  # noqa: E501
        :type duration: int
        :param cover: The cover of this Song.  # noqa: E501
        :type cover: str
        :param liked: The liked of this Song.  # noqa: E501
        :type liked: bool
        :param playlists: The playlists of this Song.  # noqa: E501
        :type playlists: List[Playlist]
        :param is_playing: The is_playing of this Song.  # noqa: E501
        :type is_playing: bool
        """
        self.swagger_types = {
            'id': int,
            'title': str,
            'artist_id': int,
            'artist': str,
            'album': str,
            'duration': int,
            'cover': str,
            'liked': bool,
            'playlists': List[Playlist], 
            'is_playing': bool
        }

        self.attribute_map = {
            'id': 'id',
            'title': 'title',
            'artist_id': 'artist_id',
            'artist': 'artist',
            'album': 'album',
            'duration': 'duration',
            'cover': 'cover',
            'liked': 'liked',
            'playlists': 'playlists',
            'is_playing': 'is_playing'
        }
        self._id = id
        self._title = title
        self._artist_id = artist_id
        self._artist = artist
        self._album = album
        self._duration = duration
        self._cover = cover
        self._liked = liked
        self._playlists = playlists 
        self._is_playing = is_playing

    @classmethod
    def from_dict(cls, dikt) -> 'Song':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Song of this Song.  # noqa: E501
        :rtype: Song
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this Song.

        Unique identifier for the song  # noqa: E501

        :return: The id of this Song.
        :rtype: int
        """
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this Song.

        Unique identifier for the song  # noqa: E501

        :param id: The id of this Song.
        :type id: int
        """

        self._id = id

    @property
    def title(self) -> str:
        """Gets the title of this Song.

        Title or name of the song  # noqa: E501

        :return: The title of this Song.
        :rtype: str
        """
        return self._title

    @title.setter
    def title(self, title: str):
        """Sets the title of this Song.

        Title or name of the song  # noqa: E501

        :param title: The title of this Song.
        :type title: str
        """

        self._title = title

    @property
    def artist_id(self) -> int:
        """Gets the artist's ID of this Song.

        ID of the artist who created the song  # noqa: E501

        :return: The artist of this Song.
        :rtype: str
        """
        return self._artist_id

    @artist_id.setter
    def artist_id(self, artist_id: int):
        """Sets the artist ID of this Song.

        Name of the artist who created the song  # noqa: E501

        :param artist: The artist of this Song.
        :type artist: str
        """

        self._artist_id = artist_id


    @property
    def artist(self) -> str:
        """Gets the artist of this Song.

        Name of the artist who created the song  # noqa: E501

        :return: The artist of this Song.
        :rtype: str
        """
        return self._artist

    @artist.setter
    def artist(self, artist: str):
        """Sets the artist of this Song.

        Name of the artist who created the song  # noqa: E501

        :param artist: The artist of this Song.
        :type artist: str
        """

        self._artist = artist

    @property
    def album(self) -> str:
        """Gets the album of this Song.

        Name of the album containing the song  # noqa: E501

        :return: The album of this Song.
        :rtype: str
        """
        return self._album

    @album.setter
    def album(self, album: str):
        """Sets the album of this Song.

        Name of the album containing the song  # noqa: E501

        :param album: The album of this Song.
        :type album: str
        """

        self._album = album

    @property
    def duration(self) -> int:
        """Gets the duration of this Song.

        Duration of the song in seconds  # noqa: E501

        :return: The duration of this Song.
        :rtype: int
        """
        return self._duration

    @duration.setter
    def duration(self, duration: int):
        """Sets the duration of this Song.

        Duration of the song in seconds  # noqa: E501

        :param duration: The duration of this Song.
        :type duration: int
        """

        self._duration = duration

    @property
    def cover(self) -> str:
        """Gets the cover of this Song.

        Album cover image URL associated with the song  # noqa: E501

        :return: The cover of this Song.
        :rtype: str
        """
        return self._cover

    @cover.setter
    def cover(self, cover: str):
        """Sets the cover of this Song.

        Album cover image URL associated with the song  # noqa: E501

        :param cover: The cover of this Song.
        :type cover: str
        """

        self._cover = cover

    @property
    def liked(self) -> bool:
        """Gets the liked of this Song.

        Flag indicating if the user has liked the song  # noqa: E501

        :return: The liked of this Song.
        :rtype: bool
        """
        return self._liked

    @liked.setter
    def liked(self, liked: bool):
        """Sets the liked of this Song.

        Flag indicating if the user has liked the song  # noqa: E501

        :param liked: The liked of this Song.
        :type liked: bool
        """

        self._liked = liked

    @property
    def playlists(self) -> List[Playlist]: 
        """Gets the playlists of this Song.

        List of Playlist objects to which the user has added the song  # noqa: E501

        :return: The playlists of this Song.
        :rtype: List[Playlist]
        """
        return self._playlists

    @playlists.setter
    def playlists(self, playlists: List[Playlist]): 
        """Sets the playlists of this Song.

        List of Playlist objects to which the user has added the song  # noqa: E501

        :param playlists: The playlists of this Song.
        :type playlists: List[Playlist]
        """

        self._playlists = playlists

    @property
    def is_playing(self) -> bool:
        """Gets the is_playing of this Song.

        Boolean flag indicating if the song is currently playing  # noqa: E501

        :return: The is_playing of this Song.
        :rtype: bool
        """
        return self._is_playing

    @is_playing.setter
    def is_playing(self, is_playing: bool):
        """Sets the is_playing of this Song.

        Boolean flag indicating if the song is currently playing  # noqa: E501

        :param is_playing: The is_playing of this Song.
        :type is_playing: bool
        """

        self._is_playing = is_playing
