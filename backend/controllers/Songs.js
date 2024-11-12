'use strict';

var utils = require('../utils/writer.js');
var Songs = require('../service/SongsService');

module.exports.get_song_by_id = function get_song_by_id (req, res, next, songId) {
  Songs.get_song_by_id(songId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
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
