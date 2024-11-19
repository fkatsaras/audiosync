'use strict';

const Home = require('../service/HomeService');
const api = require('../utils/apiUtils.js');

module.exports.home = function home(req, res, next) {

  console.log(req.current_user);
  const current_user = req.current_user; // Extracted by middleware

  if (!current_user) {
    return api.errorResponse(
      res,
      'current user query parameter required.', // Error message
      400, // HTTP status code
      null // Response body
    );
  }

  Home.home(current_user)
    .then((response) => {
      // Successfully retrieved home page links
      api.successResponse(
        res,
        response.message, // Success message
        response.body // Response body containing links
      );
    })
    .catch((error) => {
      // Handle errors from the service
      const message = error.message || 'Internal server error';
      const code = error.code || 500;
      const body = error.body || null;

      api.errorResponse(res, message, code, body);
    });
};
