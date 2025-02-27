'use strict';


/**
 * Check if a user is logged in
 * Verify if the current session has a logged-in user
 *
 * returns ApiResponse
 **/
exports.checkLogin = function(req) {
  return new Promise((resolve, reject) => {
    const now = new Date();
console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`);
    console.log(req.user);
    const user = req.user;

    if (!user || !user.id || !user.username) {
      const message = user ? 'Username not found in session.' : 'User is not logged in';
      const code = user ? 500 : 401;
      console.log(user ? user.username : message);
      return reject({ message, code });
    }

    resolve({
      message: `User ${user.username} is logged in.`,
      body: {
        user_id: user.id,
        username: user.username,
      }
    })
  })
}