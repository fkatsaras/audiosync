'use strict';

var utils = require('../utils/writer.js');
var session = require('express-session');  // Assuming you are using express-session

// A sample success and error response generator (assuming you have these utilities)
const successResponse = (message, body) => ({
  status: 'success',
  message: message,
  body: body
});

const errorResponse = (message, code) => ({
  status: 'error',
  message: message,
  code: code
});

module.exports.check_login = function check_login(req, res, next) {
  // Check if the user is logged in by verifying the session data
  if (req.session && req.session['user.id']) {
    const user_id = req.session['user.id'];
    const username = req.session['username'];  // Make sure this is set during login
    
    if (!username) {
      // If the username is not found in session, return an error
      return utils.writeJson(res, errorResponse('Username not found in session.', 500));
    }

    // If user is logged in, return a success response
    const body = {
      'user_id': user_id,
      'username': username
    };

    console.log(body);  // Debugging, can be removed in production
    return utils.writeJson(res, successResponse(`User ${username} is logged in.`, body));
  }

  // If user is not logged in, return an error response
  return utils.writeJson(res, errorResponse('User is not logged in.', 401));
};
