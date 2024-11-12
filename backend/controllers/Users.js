'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbUtils = require('../utils/dbUtils.js');
const apiUtils = require('../utils/apiUtils.js');
const router = require('../routes/index.js');

module.exports.add_liked_song = function add_liked_song (req, res, next, body, userId) {
  Users.add_liked_song(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.create_user_playlist = function create_user_playlist (req, res, next, body, userId) {
  Users.create_user_playlist(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.delete_playlist_by_id = function delete_playlist_by_id (req, res, next, userId, playlistId) {
  Users.delete_playlist_by_id(userId, playlistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.delete_user_playlist = function delete_user_playlist (req, res, next, userId, playlistId) {
  Users.delete_user_playlist(userId, playlistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.follow_artist = function follow_artist (req, res, next, body, userId) {
  Users.follow_artist(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_liked_songs = function get_liked_songs (req, res, next, userId) {
  Users.get_liked_songs(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_playlist_by_id = function get_playlist_by_id (req, res, next, userId, playlistId) {
  Users.get_playlist_by_id(userId, playlistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_recommended_songs = function get_recommended_songs (req, res, next, userId) {
  Users.get_recommended_songs(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_user_followed_artists = function get_user_followed_artists (req, res, next, userId) {
  Users.get_user_followed_artists(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_user_playlists = function get_user_playlists (req, res, next, userId) {
  Users.get_user_playlists(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.login_user = async function login_user(req, res) { 
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return apiUtils.errorResponse(res, 'Username or password missing', 400);
  }

  console.log(`Login attempt - Username: ${username}`);

  try {
    // Call the service to handle login
    const response = await Users.loginUser(username, password);
    
    // If response has a token, it's a success
    if (response.token) {
      return apiUtils.successResponse(res, 'Login successful', { token: response.token });
    } else {
      // If there's no token in response, it's an error
      return apiUtils.errorResponse(res, response.message || 'Login failed', 401);
    }
  } catch (error) {
    console.error(`Exception during login: ${error.message}`);
    return apiUtils.errorResponse(res, 'An error occurred', 500);
  }
};

module.exports.logout_user = function logout_user (req, res, next, body) {
  Users.logout_user(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.registerUser = function registerUser (req, res, next, body) {
  Users.registerUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.remove_liked_song = function remove_liked_song (req, res, next, userId, songId) {
  Users.remove_liked_song(userId, songId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.unfollow_artist = function unfollow_artist (req, res, next, userId, artist_id) {
  Users.unfollow_artist(userId, artist_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.update_playlist_by_id = function update_playlist_by_id (req, res, next, body, userId, playlistId) {
  Users.update_playlist_by_id(body, userId, playlistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
