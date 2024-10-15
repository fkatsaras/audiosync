# coding: utf-8

from __future__ import absolute_import, annotations
from datetime import date, datetime  # noqa: F401
from typing import List, TYPE_CHECKING

from app.models.base_model_ import Model
from app import util

if TYPE_CHECKING:
    from app.models.song import Song

class Playlist(Model):
    """Playlist - a model defined in Swagger"""

    def __init__(self, id: int=None, title: str=None, songs: List[Song]=None, edit_mode: bool=None, cover: str=None, owner: int=None, is_public: bool=None, created_at: str=None, updated_at: str=None):  # noqa: E501
        """Playlist - a model defined in Swagger

        :param id: The id of this Playlist.  # noqa: E501
        :type id: int
        :param title: The title of this Playlist.  # noqa: E501
        :type title: str
        :param songs: The songs of this Playlist.  # noqa: E501
        :type songs: List[Song]
        :param edit_mode: The edit_mode of this Playlist.  # noqa: E501
        :type edit_mode: bool
        :param cover: The cover of this Playlist.  # noqa: E501
        :type cover: str
        :param owner: The owner of this Playlist.  # noqa: E501
        :type owner: int
        :param is_public: The is_public of this Playlist.  # noqa: E501
        :type is_public: bool
        :param created_at: The created_at timestamp of this Playlist.  # noqa: E501
        :type created_at: str
        :param updated_at: The updated_at timestamp of this Playlist.  # noqa: E501
        :type updated_at: str
        """
        self.swagger_types = {
            'id': int,
            'title': str,
            'songs': List[Song],
            'edit_mode': bool,
            'cover': str,
            'owner': int,
            'is_public': bool,
            'created_at': str,
            'updated_at': str
        }

        self.attribute_map = {
            'id': 'id',
            'title': 'title',
            'songs': 'songs',
            'edit_mode': 'editMode',
            'cover': 'cover',
            'owner': 'owner',
            'is_public': 'is_public',
            'created_at': 'created_at',
            'updated_at': 'updated_at'
        }

        self._id = id
        self._title = title
        self._songs = songs
        self._edit_mode = edit_mode
        self._owner = owner
        self._is_public = is_public
        self._created_at = created_at
        self._updated_at = updated_at

    @classmethod
    def from_dict(cls, dikt) -> 'Playlist':
        """Returns the dict as a model"""
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this Playlist."""
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this Playlist."""
        self._id = id

    @property
    def title(self) -> str:
        """Gets the title of this Playlist."""
        return self._title

    @title.setter
    def title(self, title: str):
        """Sets the title of this Playlist."""
        self._title = title

    @property
    def songs(self) -> List[Song]:
        """Gets the songs of this Playlist."""
        return self._songs

    @songs.setter
    def songs(self, songs: List[Song]):
        """Sets the songs of this Playlist."""
        self._songs = songs

    @property
    def edit_mode(self) -> bool:
        """Gets the edit_mode of this Playlist."""
        return self._edit_mode

    @edit_mode.setter
    def edit_mode(self, edit_mode: bool):
        """Sets the edit_mode of this Playlist."""
        self._edit_mode = edit_mode

    @property
    def cover(self) -> str:
        """Gets the cover of this Playlist.

        Album cover image URL associated with the Playlist  # noqa: E501

        :return: The cover of this Playlist.
        :rtype: str
        """
        return self._cover

    @cover.setter
    def cover(self, cover: str):
        """Sets the cover of this Playlist.

        Album cover image URL associated with the Playlist  # noqa: E501

        :param cover: The cover of this Playlist.
        :type cover: str
        """

        self._cover = cover

    @property
    def owner(self) -> int:
        """Gets the owner of this Playlist."""
        return self._owner

    @owner.setter
    def owner(self, owner: int):
        """Sets the owner of this Playlist."""
        self._owner = owner

    @property
    def is_public(self) -> bool:
        """Gets the is_public of this Playlist."""
        return self._is_public

    @is_public.setter
    def is_public(self, is_public: bool):
        """Sets the is_public of this Playlist."""
        self._is_public = is_public

    @property
    def created_at(self) -> str:
        """Gets the created_at timestamp of this Playlist."""
        return self._created_at

    @created_at.setter
    def created_at(self, created_at: str):
        """Sets the created_at timestamp of this Playlist."""
        self._created_at = created_at

    @property
    def updated_at(self) -> str:
        """Gets the updated_at timestamp of this Playlist."""
        return self._updated_at

    @updated_at.setter
    def updated_at(self, updated_at: str):
        """Sets the updated_at timestamp of this Playlist."""
        self._updated_at = updated_at
