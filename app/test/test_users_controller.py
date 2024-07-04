# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from app.models.artist import Artist  # noqa: E501
from app.models.playlist import Playlist  # noqa: E501
from app.models.song import Song  # noqa: E501
from app.test import BaseTestCase


class TestUsersController(BaseTestCase):
    """UsersController integration test stubs"""

    def test_add_liked_song(self):
        """Test case for add_liked_song

        User likes a song
        """
        body = Song()
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/liked-songs'.format(user_id=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_create_user_playlist(self):
        """Test case for create_user_playlist

        Create a new playlist
        """
        body = Playlist()
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/my-playlists'.format(user_id=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_playlist_by_id(self):
        """Test case for delete_playlist_by_id

        Delete a specific playlist
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/playlists/{playlist-id}'.format(user_id=56, playlist_id=56),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_user_playlist(self):
        """Test case for delete_user_playlist

        Delete a user's playlist
        """
        query_string = [('playlist_id', 56)]
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/my-playlists'.format(user_id=56),
            method='DELETE',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_follow_artist(self):
        """Test case for follow_artist

        Follow an artist
        """
        body = Artist()
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/my-artists'.format(user_id=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_liked_songs(self):
        """Test case for get_liked_songs

        Get liked songs of a user
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/liked-songs'.format(user_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_playlist_by_id(self):
        """Test case for get_playlist_by_id

        Get details of a specific playlist
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/playlists/{playlist-id}'.format(user_id=56, playlist_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_recommended_songs(self):
        """Test case for get_recommended_songs

        Get recommended songs for a user
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/recommended'.format(user_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_user_followed_artists(self):
        """Test case for get_user_followed_artists

        Get followed artists
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/my-artists'.format(user_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_user_playlists(self):
        """Test case for get_user_playlists

        Get user's playlists
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/my-playlists'.format(user_id=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_login_user(self):
        """Test case for login_user

        Logs user into the system
        """
        query_string = [('username', 'username_example'),
                        ('password', 'password_example')]
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/login',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_logout_user(self):
        """Test case for logout_user

        Logs out current logged in user session
        """
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/logout',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_liked_song(self):
        """Test case for remove_liked_song

        User unlikes a song
        """
        query_string = [('song_id', 56)]
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/liked-songs'.format(user_id=56),
            method='DELETE',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_unfollow_artist(self):
        """Test case for unfollow_artist

        Unfollow an artist
        """
        query_string = [('artist_id', 56)]
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/my-artists'.format(user_id=56),
            method='DELETE',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_playlist_by_id(self):
        """Test case for update_playlist_by_id

        Update details of a specific playlist
        """
        body = Playlist()
        response = self.client.open(
            '/KATSARASFOTIS99/swagger-audio_sync_open_api_3_0/1.0.11/users/{user-id}/playlists/{playlist-id}'.format(user_id=56, playlist_id=56),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
