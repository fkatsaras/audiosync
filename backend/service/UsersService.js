'use strict';

const bcrypt = require('bcrypt');
const db = require('../utils/dbUtils');
const api = require('../utils/apiUtils');
const { resolve } = require('swagger-parser');


/**
 * User likes a song
 * Add a new song to the list of liked songs for a specific user
 *
 * body Song Song object to be added to liked songs
 * userId Integer ID of the user to add the liked song
 * no response value expected for this operation
 **/
exports.add_liked_song = function(body,userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new playlist
 * Create a new playlist for a specific user
 *
 * body Playlist Playlist object to be created
 * userId Integer ID of the user to create the playlist for
 * returns Playlist
 **/
exports.create_user_playlist = function(body,userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "songs" : [ null, null ],
  "editMode" : true,
  "id" : 123,
  "title" : "My Favorite Songs"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Delete a specific playlist
 * Delete a specific playlist created by a user
 *
 * userId Integer ID of the user who owns the playlist
 * playlistId Integer ID of the playlist to delete
 * no response value expected for this operation
 **/
exports.delete_playlist_by_id = function(userId,playlistId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete a user's playlist
 * Delete a specific playlist created by a user
 *
 * userId Integer ID of the user who owns the playlist to delete
 * playlistId Integer ID of the playlist to delete
 * no response value expected for this operation
 **/
exports.delete_user_playlist = function(userId,playlistId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Follow an artist
 * Add an artist to the user's followed artists
 *
 * body Artist Artist object that needs to be followed
 * userId Integer The ID of the user
 * no response value expected for this operation
 **/
exports.follow_artist = function(body,userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get liked songs of a user
 * Retrieve the list of songs liked by a specific user
 *
 * userId Integer ID of the user whose liked songs are to be fetched
 * returns List
 **/
exports.get_liked_songs = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "duration" : 300,
  "cover" : "https://1.bp.blogspot.com/-e2j5SK7JAC8/XmHhBKZJyEI/AAAAAAAABto/A1cfumUwHuA_8MFlAEtdpN5rLHlpVOd6ACLcBGAsYHQ/s1600/Iron%2BMaiden%2B-%2BPowerslave%2B%25281984%2529%2Bfront%2Bback%2Balbum%2Bcovers.jpg",
  "artist" : "Iron Maiden",
  "album" : "Powerslave",
  "playlists" : [ {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  }, {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  } ],
  "is_playing" : false,
  "id" : 456,
  "title" : "Aces High",
  "liked" : true
}, {
  "duration" : 300,
  "cover" : "https://1.bp.blogspot.com/-e2j5SK7JAC8/XmHhBKZJyEI/AAAAAAAABto/A1cfumUwHuA_8MFlAEtdpN5rLHlpVOd6ACLcBGAsYHQ/s1600/Iron%2BMaiden%2B-%2BPowerslave%2B%25281984%2529%2Bfront%2Bback%2Balbum%2Bcovers.jpg",
  "artist" : "Iron Maiden",
  "album" : "Powerslave",
  "playlists" : [ {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  }, {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  } ],
  "is_playing" : false,
  "id" : 456,
  "title" : "Aces High",
  "liked" : true
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get details of a specific playlist
 * Retrieve details of a specific playlist created by a user
 *
 * userId Integer ID of the user who owns the playlist
 * playlistId Integer ID of the playlist to fetch details for
 * returns Playlist
 **/
exports.get_playlist_by_id = function(userId,playlistId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "songs" : [ null, null ],
  "editMode" : true,
  "id" : 123,
  "title" : "My Favorite Songs"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get recommended songs for a user
 * Retrieve recommended songs for a specific user based on their preferences
 *
 * userId Integer ID of the user to fetch recommended songs for
 * returns List
 **/
exports.get_recommended_songs = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "duration" : 300,
  "cover" : "https://1.bp.blogspot.com/-e2j5SK7JAC8/XmHhBKZJyEI/AAAAAAAABto/A1cfumUwHuA_8MFlAEtdpN5rLHlpVOd6ACLcBGAsYHQ/s1600/Iron%2BMaiden%2B-%2BPowerslave%2B%25281984%2529%2Bfront%2Bback%2Balbum%2Bcovers.jpg",
  "artist" : "Iron Maiden",
  "album" : "Powerslave",
  "playlists" : [ {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  }, {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  } ],
  "is_playing" : false,
  "id" : 456,
  "title" : "Aces High",
  "liked" : true
}, {
  "duration" : 300,
  "cover" : "https://1.bp.blogspot.com/-e2j5SK7JAC8/XmHhBKZJyEI/AAAAAAAABto/A1cfumUwHuA_8MFlAEtdpN5rLHlpVOd6ACLcBGAsYHQ/s1600/Iron%2BMaiden%2B-%2BPowerslave%2B%25281984%2529%2Bfront%2Bback%2Balbum%2Bcovers.jpg",
  "artist" : "Iron Maiden",
  "album" : "Powerslave",
  "playlists" : [ {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  }, {
    "songs" : [ null, null ],
    "editMode" : true,
    "id" : 123,
    "title" : "My Favorite Songs"
  } ],
  "is_playing" : false,
  "id" : 456,
  "title" : "Aces High",
  "liked" : true
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get followed artists
 * Retrieve the list of artists followed by the user
 *
 * userId Integer The ID of the user
 * returns List
 **/
exports.get_user_followed_artists = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "followers" : 5000,
  "songs" : [ null, null ],
  "name" : "Iron Maiden",
  "is_followed" : true,
  "id" : 1
}, {
  "followers" : 5000,
  "songs" : [ null, null ],
  "name" : "Iron Maiden",
  "is_followed" : true,
  "id" : 1
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get user's playlists
 * Retrieve the playlists created by a specific user
 *
 * userId Integer ID of the user whose playlists are to be fetched
 * returns List
 **/
exports.get_user_playlists = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "songs" : [ null, null ],
  "editMode" : true,
  "id" : 123,
  "title" : "My Favorite Songs"
}, {
  "songs" : [ null, null ],
  "editMode" : true,
  "id" : 123,
  "title" : "My Favorite Songs"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Authenticates a user and generates a JWT token if the credentials are valid.
 *
 * @function login_user
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password provided by the user for authentication.
 * @returns {Promise<Object>} - A promise that resolves with a JWT token if successful, or an error object if not.
 */
exports.login_user = function(username, password) {
  return new Promise(async (resolve, reject) => {
    const connection = db.createConnection();
    console.log(`Login attempt - Username: ${username}`);

    if(!connection) {
      return reject({ message: 'DB connection failed', code: 500 });
    }

    try {
      console.log(`Calling stored procedure login_user with username: ${username}`);
      const [userDetails] = await db.callProcedure(
        connection,
        'login_user',
        [username],
        ['p_password_hash', 'p_user_id', 'p_success', 'p_message']
      );

     // Check if userDetails is an array with expected values
     if (!Array.isArray(userDetails) || userDetails.length < 4) {
        throw new Error("Unexpected data structure for user details.");
      }

      const [passwordHash, userId, success, message] = userDetails;

      if (success === 1 && passwordHash) {
        if (bcrypt.compareSync(password, passwordHash)) {
          console.log("Credentials are valid");

          const token = jwt.sign(
            {
              user_id: userId,
              username: username,
              exp: Math.floor(Date.now() / 1000) + (60 * 60)  // 1 hour expiry
            },
            process.env.JWT_SECRET_KEY,
            { algorithm: 'HS256' }
          );

          resolve({ token });
        } else {
          console.error("Invalid password");
          reject({ message: 'Invalid password', code: 401 });
        }
      } else {
        console.error(message);
        reject({ message, code: 500 });
      }
    } catch (error) {
      console.error(`Exception during login: ${error.message}`);
      reject({ message: `An error occurred during login: ${error.message}`, code: 500 });
    } finally {
      db.closeConnection(connection);
    }
  });
};
/**
 * Logs out the current logged-in user session
 * Logs out the user by clearing their session information.
 *
 * body Users_logout_body  (optional)
 * returns inline_response_200_4
 **/
exports.logout_user = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "Logged out successfully!"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Handles the registration of a new user.
 *
 * @async
 * @function register_user
 * @param {Object} body - The request body containing user details.
 * @param {string} body.username - The user's username.
 * @param {string} body.password - The user's password.
 * @param {string} body.email - The user's email.
 * @param {string} [body.first_name] - The user's first name (optional).
 * @param {string} [body.last_name] - The user's last name (optional).
 * 
 * @returns {Promise<Object>} - Resolves with a success message and user details if registration is successful.
 * 
 * @throws {Object} - Throws an error object with message and code if registration fails.
 */
exports.register_user = async function(body) {
  try {
    // Extract required fields
    const { username, password, email, first_name, last_name } = body;

    if (!username || !password || !email) {
      throw { message: "Missing required fields for regisration", code: 400 };
    }

    const passswordHash = await bcrypt.hash(password, 10);

    const connection = db.createConnection();

    try {
      const [p_success, p_message] = await db.callProcedure(
        connection,
        'register_user',
        [username, passswordHash, email, first_name, last_name],
        ['p_success', 'p_message']
      );

      if (p_success == 1) {
        return { message: p_message, body: {username, email} };
      } else {
        throw { message: p_message, code: 400 };
      }
    } catch (error) {
      connection.rollback();
      throw { message: `Error registering user: ${error.message}`, code: 500 };
    } finally {
      db.closeConnection(connection);
    }
  } catch (error) {
    throw error;
  }
};


/**
 * User unlikes a song
 * Remove a specific song from the list of liked songs for a user
 *
 * userId Integer ID of the user to remove the liked song from
 * songId Integer ID of the song to be removed from liked songs
 * no response value expected for this operation
 **/
exports.remove_liked_song = function(userId,songId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Unfollow an artist
 * Remove an artist from the user's followed artists
 *
 * userId Integer The ID of the user
 * artist_id Integer The ID of the artist to unfollow
 * no response value expected for this operation
 **/
exports.unfollow_artist = function(userId,artist_id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update details of a specific playlist
 * Update details of a specific playlist owned by a user
 *
 * body Playlist Updated playlist object
 * userId Integer ID of the user who owns the playlist
 * playlistId Integer ID of the playlist to update
 * no response value expected for this operation
 **/
exports.update_playlist_by_id = function(body,userId,playlistId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

