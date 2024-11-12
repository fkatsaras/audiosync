'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

module.exports.check_login = function check_login (req, res, next) {
  Auth.check_login()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
