'use strict';

var utils = require('../utils/writer.js');
var Artists = require('../service/ArtistsService');
const { successResponse, errorResponse } = require('../utils/apiUtils.js');


module.exports.get_artist_by_id = function (req, res, next) {
  const artistId = req.openapi.pathParams.artistId;
  const userId = req.user.id; 
  Artists.get_artist_by_id(userId, artistId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code || 500);
    });
};
