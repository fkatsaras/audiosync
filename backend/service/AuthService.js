'use strict';


/**
 * Check if a user is logged in
 * Verify if the current session has a logged-in user
 *
 * returns ApiResponse
 **/
exports.checkLogin = function(req) {
  return new Promise(function(resolve, reject) {
    console.log(req.session.user);
    if (req.session && req.session.user.id) {
      const user_id = req.session.user.id;
      const username = req.session.user.username;


      if (!username) {
        // Reject if the username is missing from the session
        console.log(username);
        reject({
          message: 'Username not found in session.',
          code: 500,
        });
      } else {
        // Resolve with user data if logged in
        resolve({
          message: `User ${username} is logged in.`,
          body: {
            'user_id': user_id,
            'username': username,
          },
        });
      }
    } else {
      // Reject if the user is not logged in
      reject({
        message: 'User is not logged in.',
        code: 401,
      });
    }
  });
};