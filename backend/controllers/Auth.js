'use strict';

const api = require('../utils/apiUtils.js');
const Auth = require('../service/AuthService.js');

module.exports.check_login = function check_login(req, res, next) {
  Auth.checkLogin(req)
    .then(response => {
      api.successResponse(res, response.message, response.body);
    })
    .catch(error => {
      api.errorResponse(res, error.message, error.code);
    });
};