'use strict';

const Home = require('../service/HomeService');
const api = require('../utils/apiUtils.js');

module.exports.home = function home(req, res, next) {

  const current_user = req.current_user; // Extracted by middleware

  if (!current_user) {
    return api.errorResponse(
      res,
      'current user query parameter required.',
      400,
      null
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
