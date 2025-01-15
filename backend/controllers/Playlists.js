'use strict';

var Playlists = require('../service/PlaylistsService');
const { successResponse, errorResponse } = require('../utils/apiUtils');

module.exports.get_playlist_by_id = function (req, res, next) {
  const userId = req.session.user.id;
  const playlistId = req.query.playlistId;
  Playlists.get_playlist_by_id(userId, playlistId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

module.exports.update_playlist_by_id = function (req, res, next, body) {
  const userId = req.session.user.id;
  const playlistId = req.query.playlistId;
  Playlists.update_playlist_by_id(body, userId, playlistId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

module.exports.delete_playlist_by_id = function (req, res, next) {
  const userId = req.session.user.id;
  const playlistId = req.query.playlistId;
  Playlists.delete_playlist_by_id(userId, playlistId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};
