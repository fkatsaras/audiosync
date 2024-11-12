'use strict';

var utils = require('../utils/writer.js');
var Home = require('../service/HomeService');

module.exports.home = function home (req, res, next, current_user) {
  Home.home(current_user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
