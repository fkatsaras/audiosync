'use strict';

var Songs = require('../service/SongsService');
const { successResponse, errorResponse } = require('../utils/apiUtils');

module.exports.get_song_by_id = function get_song_by_id (req, res, next) {
  const songId = req.openapi.pathParams.songId;
  const userId = req.session.user.id;
  Songs.get_song_by_id(userId, songId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code || 500);
    });
};

module.exports.get_song_play_status = function get_song_play_status (req, res, next, songId) {
  Songs.get_song_play_status(songId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.toggle_song_playback = function toggle_song_playback (req, res, next, songId) {
  Songs.toggle_song_playback(songId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
