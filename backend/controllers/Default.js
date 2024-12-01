'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService.js');

module.exports.apiV1SearchSongsGET = function apiV1SearchSongsGET (req, res, next, user_query, userId) {
  Default.apiV1SearchSongsGET(user_query, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
