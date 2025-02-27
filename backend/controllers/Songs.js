'use strict';

const Song = require('../models/Song');
var Songs = require('../service/SongsService');
const { successResponse, errorResponse } = require('../utils/apiUtils');

module.exports.get_song_by_id = function (req, res, next) {
  const songId = req.openapi.pathParams.songId;
  const userId = req.user.id;
  Songs.get_song_by_id(userId, songId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code || 500);
    });
};

// Check if lyrics are available for the song
module.exports.get_song_lyrics = function (req, res, next) {
  const songId = req.openapi.pathParams.songId;

  Songs.get_song_lyrics(songId)
    .then(function (response) {
      if (response) {
        // Lyrics available
        successResponse(res, 'Lyrics are available', response.body);
      }
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code || 500);
    });
};