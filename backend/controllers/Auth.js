'use strict';

var utils = require('../utils/writer.js');
const api = require('../utils/apiUtils.js');

module.exports.check_login = function check_login(req, res, next) {
  // Check if the user is logged in by verifying the session data
  if (req.session && req.session['user.id']) {
    const user_id = req.session['user.id'];
    const username = req.session['username']; 
    
    if (!username) {
      // If the username is not found in session, return an error
      return api.errorResponse('Username not found in session.', 500);
    }

    // If user is logged in, return a success response
    const body = {
      'user_id': user_id,
      'username': username
    };

    console.log(body);  // Debugging, can be removed in production
    return api.successResponse(`User ${username} is logged in.`, body);
  }

  // If user is not logged in, return an error response
  return api.errorResponse('User is not logged in.', 401);
};
