'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService.js');
const { successResponse, errorResponse } = require('../utils/apiUtils.js');

module.exports.like_song = function (req, res, next) {
  const songId = req.query.songId;
  const userId = req.session.user.id;
  Users.like_song(userId, songId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

module.exports.unlike_song = function (req, res, next) {
  const songId = req.query.songId;
  const userId = req.session.user.id;
  Users.unlike_song(userId, songId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

module.exports.follow_artist = function (req, res, next) {
  const artistId = req.query.artistId;
  const userId = req.session.user.id;
  Users.follow_artist(artistId, userId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

module.exports.unfollow_artist = function (req, res, next) {
  const artistId = req.query.artistId;
  const userId = req.session.user.id;
  Users.unfollow_artist(artistId, userId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};


module.exports.create_user_playlist = function (req, res, next, body) {
  const userId = req.session.user.id;
  // Check if title is provided
  if (!body.title || !body.title.trim()) {
    return errorResponse(res, 'Please provide a name for your Playlist', 400);
  }
  Users.create_user_playlist(body, userId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};


module.exports.get_liked_songs = function (req, res, next) {
  const userId = req.session.user.id;
  Users.get_liked_songs(userId)
    .then(function (response) {
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

// module.exports.get_recommended_songs = function get_recommended_songs (req, res, next, userId) {
//   Users.get_recommended_songs(userId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

module.exports.get_user_followed_artists = function (req, res, next, userId) {
  Users.get_user_followed_artists(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_user_playlists = function (req, res, next) {
  const userId = req.session.user.id;
  Users.get_user_playlists(userId)
    .then(function (response) {
      console.log(response.body);
      successResponse(res, response.message, response.body);
    })
    .catch(function (error) {
      errorResponse(res, error.message, error.code);
    });
};

module.exports.login_user = async function (req, res) {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return errorResponse(res, 'Username and password are required', 400);
  }

  try {
    const response = await Users.login_user(username, password);

    // Set session for the user
    req.session.user = {
      id: response.userId,
      username: response.username,
    };

    // Debug
    console.log(`User logged in: ${response.username}`);
    // console.log(req.session);
    return successResponse(res, 'Login successful', { token: response.token });
  } catch (error) {
    console.error(`Login failed for ${username}: ${error.details || error.message}`);
    const statusCode = error.code || 500;
    return errorResponse(res, error.message, statusCode);
  }
};

/**
 * Controller to handle user logout
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
module.exports.logout_user = async function (req, res) {
  const response = await Users.logout_user(req.body);
  try {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
      if (err) {
        return errorResponse(
          res,
          'Failed to log out',
          500
        );
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid');
      
      return successResponse(
        res,
        'Logout successful',
        { username: response.username }
      );
    });
  } catch (error) {
    console.error(`Logout failed: ${error.message}`);
    return errorResponse(
      res,
      'Internal server error',
      500
    );
  }
};


/**
 * Registers a new user by calling the user service with the provided request body data.
 * 
 * @function register_user
 * @param {Object} req - The request object, containing user data in `req.body`.
 * @param {Object} res - The response object used to send success or error responses.
 * 
 * @returns {Object} JSON response indicating success or error of user registration.
 */
module.exports.register_user = async function (req, res) {
  const { username, password, email } = req.body;

  // Validate request body
  if (!username || !password || !email) {
    return errorResponse(res, 'Missing required fields: username, password, or email', 400);
  }

  try {
    const response = await Users.register_user(req.body);

    console.log(`User registered: ${response.body.username}`);
    return successResponse(res, response.message, response.body, 201);
  } catch (error) {
    console.error(`Registration failed for user ${username}: ${error.details || error.message}`);
    const statusCode = error.code || 500;
    return errorResponse(res, error.message, statusCode);
  }
};