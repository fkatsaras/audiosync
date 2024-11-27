'use strict';

var Playlists = require('../service/PlaylistsService');
const { successResponse, errorResponse } = require('../utils/apiUtils');

module.exports.get_playlist_by_id = function get_playlist_by_id (req, res, next) {
    const userId = req.session.user.id;
    const playlistId = req.query.playlistId;
    Playlists.get_playlist_by_id(userId, playlistId)
      .then(function (response) {
        successResponse(res, response.message, response.body);
      })
      .catch(function (error) {
        successResponse(res, error.message, error.code);
      });
  };