# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from app.models.search_result import SearchResult  # noqa: E501
from app.test import BaseTestCase


class TestSearchController(BaseTestCase):
    """SearchController integration test stubs"""

    def test_search_artists_get(self):
        """Test case for search_artists_get

        Search for artists
        """
        query_string = [('q', 'q_example')]
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/search/artists',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_search_songs_get(self):
        """Test case for search_songs_get

        Search for songs
        """
        query_string = [('q', 'q_example')]
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/search/songs',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
