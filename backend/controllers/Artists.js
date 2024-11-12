'use strict';

var utils = require('../utils/writer.js');
var Artists = require('../service/ArtistsService');

module.exports.get_artist_songs = function get_artist_songs (req, res, next, artistId) {
  Artists.get_artist_songs(artistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.gett_artist_by_id = function gett_artist_by_id (req, res, next, artistId) {
  Artists.gett_artist_by_id(artistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
