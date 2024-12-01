'use strict';

const api = require('../utils/apiUtils.js');
const Auth = require('../service/AuthService.js');

module.exports.check_login = function check_login(req, res, next) {
  // Business logic goes to the service layer
  Auth.checkLogin(req)
    .then(response => {
      // On success, send the response with the user's login info
      api.successResponse(res, response.message, response.body);
    })
    .catch(error => {
      // On failure, return an error response
      api.errorResponse(res, error.message, error.code);
    });
};