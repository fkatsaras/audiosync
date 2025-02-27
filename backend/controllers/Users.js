'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService.js');
const { successResponse, errorResponse } = require('../utils/apiUtils.js');

module.exports.like_song = async function (req, res, next) {
  try {
    const songId = req.query?.songId;
    const userId = req.user?.id;

    const { message, body: responseBody } = await Users.like_song(userId, songId);
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.unlike_song = async function (req, res, next) {
  try {
    const songId = req.query?.songId;
    const userId = req.user?.id;

    const { message, body: responseBody } = await Users.unlike_song(userId, songId);
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.follow_artist = async function (req, res, next) {
  try {
    const artistId = req.query?.artistId;
    const userId = req.user?.id;

    const { message, body: responseBody } = await Users.follow_artist(artistId, userId);
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.unfollow_artist = async function (req, res, next) {
  try {
    const artistId = req.query?.artistId;
    const userId = req.user?.id;

    const { message, body: responseBody } = await Users.unfollow_artist(artistId, userId);
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.create_user_playlist = async function (req, res, next, body) {
  try {
    const userId = req.user?.id;

    // Check if title is provided
    if (!body?.title?.trim()) { // Optional chaining for safer access
      return errorResponse(res, 'Please provide a name for your Playlist', 400);
    }

    const { message, body: responseBody } = await Users.create_user_playlist(body, userId);
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.get_liked_songs = async function (req, res, next) {
  try {
    const userId = req.user?.id;

    const { message, body: responseBody } = await Users.get_liked_songs(userId);
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.get_user_followed_artists = async function (req, res, next) {
  try {
    const userId = req.user.id;
    const { message, body } = await Users.get_user_followed_artists(userId);

    successResponse(res, message, body);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};


module.exports.add_to_user_history = async function (req, res, next, body) {
  try {
    const userId = req.user.id
    // Check if song id is provided
    if (!body?.song_id) {
      return errorResponse(res, 'Please provide a song id to add to history', 400);
    }

    const { message, body: responseBody } = await Users.add_to_user_history(body, userId)
    successResponse(res, message, responseBody);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
};

module.exports.get_user_history = async function (req, res, next) {
  try {
    const userId = req.user.id;

    // Pass the latest query parameter to 
    // check if we only want the latest song or the full history
    console.log(userId, req.query.latest);
    const { message, body } = await Users.get_user_history(userId, req.query.latest);
    
    successResponse(res, message, body);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
}

// module.exports.get_recommended_songs = function get_recommended_songs (req, res, next, userId) {
//   Users.get_recommended_songs(userId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

module.exports.get_user_playlists = async function (req, res, next) {
  try {
    const userId = req.user.id;
    const { message, body } = await Users.get_user_playlists(userId);

    successResponse(res, message, body);
  } catch (error) {
    errorResponse(res, error.message, error.code);
  }
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
    req.user = {
      id: response.userId,
      username: response.username,
    };

    const now = new Date();
console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`);

    // Debug
    console.log(`User logged in: ${response.username}`);
    return successResponse(res, 'Login successful', { token: response.token });
  } catch (error) {
    console.error(`Login failed for ${username}: ${error.details || error.message}`);
    const statusCode = error.code || 500;
    return errorResponse(res, error.message, statusCode);
  }
};

/**
 * Controller to handle user logout
 */
module.exports.logout_user = async function (req, res) {
  try {
    const response = await Users.logout_user(req.body);
    
    // The client is responsible for removing the token
    
    return successResponse(
      res,
      'Logout successful',
      { 
        username: response.username,
        message: "Token has been invalidated" 
      }
    );
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