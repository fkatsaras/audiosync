# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from app.models.base_model_ import Model
from app import util


class InlineResponse200(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, is_playing: bool=None):  # noqa: E501
        """InlineResponse200 - a model defined in Swagger

        :param is_playing: The is_playing of this InlineResponse200.  # noqa: E501
        :type is_playing: bool
        """
        self.swagger_types = {
            'is_playing': bool
        }

        self.attribute_map = {
            'is_playing': 'is_playing'
        }
        self._is_playing = is_playing

    @classmethod
    def from_dict(cls, dikt) -> 'InlineResponse200':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The inline_response_200 of this InlineResponse200.  # noqa: E501
        :rtype: InlineResponse200
        """
        return util.deserialize_model(dikt, cls)

    @property
    def is_playing(self) -> bool:
        """Gets the is_playing of this InlineResponse200.

        Indicates whether the song is currently playing or paused  # noqa: E501

        :return: The is_playing of this InlineResponse200.
        :rtype: bool
        """
        return self._is_playing

    @is_playing.setter
    def is_playing(self, is_playing: bool):
        """Sets the is_playing of this InlineResponse200.

        Indicates whether the song is currently playing or paused  # noqa: E501

        :param is_playing: The is_playing of this InlineResponse200.
        :type is_playing: bool
        """

        self._is_playing = is_playing
