# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from app.models.base_model_ import Model
from app.models.home_page_response_links import HomePageResponseLinks  # noqa: F401,E501
from app import util


class HomePageResponse(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, links: HomePageResponseLinks=None):  # noqa: E501
        """HomePageResponse - a model defined in Swagger

        :param links: The links of this HomePageResponse.  # noqa: E501
        :type links: HomePageResponseLinks
        """
        self.swagger_types = {
            'links': HomePageResponseLinks
        }

        self.attribute_map = {
            'links': 'links'
        }
        self._links = links

    @classmethod
    def from_dict(cls, dikt) -> 'HomePageResponse':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The HomePageResponse of this HomePageResponse.  # noqa: E501
        :rtype: HomePageResponse
        """
        return util.deserialize_model(dikt, cls)

    @property
    def links(self) -> HomePageResponseLinks:
        """Gets the links of this HomePageResponse.


        :return: The links of this HomePageResponse.
        :rtype: HomePageResponseLinks
        """
        return self._links

    @links.setter
    def links(self, links: HomePageResponseLinks):
        """Sets the links of this HomePageResponse.


        :param links: The links of this HomePageResponse.
        :type links: HomePageResponseLinks
        """

        self._links = links
