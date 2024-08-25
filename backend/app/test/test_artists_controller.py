# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from app.models.artist import Artist  # noqa: E501
from app.models.song import Song  # noqa: E501
from app.test import BaseTestCase


class TestArtistsController(BaseTestCase):
    """ArtistsController integration test stubs"""

    def test_get_artist_songs(self):
        """Test case for get_artist_songs

        Get artist songs
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/artists/{artist-id}/songs'.format(artist_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_gett_artist_by_id(self):
        """Test case for gett_artist_by_id

        Get artist by id
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/artists/{artist-id}'.format(artist_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
