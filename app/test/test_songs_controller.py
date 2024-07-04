# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from app.models.inline_response200 import InlineResponse200  # noqa: E501
from app.models.song import Song  # noqa: E501
from app.test import BaseTestCase


class TestSongsController(BaseTestCase):
    """SongsController integration test stubs"""

    def test_get_song_by_id(self):
        """Test case for get_song_by_id

        Get song by ID
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/songs/{song-id}'.format(song_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_song_play_status(self):
        """Test case for get_song_play_status

        Get play status of a song
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/songs/{song-id}/play'.format(song_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_toggle_song_playback(self):
        """Test case for toggle_song_playback

        Toggle play/pause of a song
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/songs/{song-id}/play'.format(song_id=56),
            method='PUT')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
