'use strict';

var utils = require('../utils/writer.js');
var Search = require('../service/SearchService');

module.exports.search_artists_get = function search_artists_get (req, res, next, q) {
  Search.search_artists_get(q)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
