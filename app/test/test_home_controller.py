# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from app.models.home_page_response import HomePageResponse  # noqa: E501
from app.test import BaseTestCase


class TestHomeController(BaseTestCase):
    """HomeController integration test stubs"""

    def test_home_get(self):
        """Test case for home_get

        Get Home Page GUI
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/home',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
