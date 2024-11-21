'use strict';

var utils = require('../utils/writer.js');
var Artists = require('../service/ArtistsService');
const { successResponse, errorResponse } = require('../utils/apiUtils.js');

module.exports.get_artist_songs = function get_artist_songs (req, res, next, artistId) {
  Artists.get_artist_songs(artistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_artist_by_id = function get_artist_by_id (req, res, next) {
  const artistId = req.openapi.pathParams.artistId;
  const userId = req.current_user; 
  Artists.get_artist_by_id(userId, artistId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code || 500);
    });
};
