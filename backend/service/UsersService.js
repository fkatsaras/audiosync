'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../utils/dbUtils');
const { fromObject } = require('../models/Song');
const { get_playlist_by_id } = require('./PlaylistsService');


/**
 * User likes a song
 * Add a new song to the list of liked songs for a specific user
 *
 * body Song Song object to be added to liked songs
 * userId Integer ID of the user to add the liked song
 * no response value expected for this operation
 **/
exports.like_song = function(userId, songId) {
  return new Promise(async (resolve, reject) => {

    const connection = db.createConnection();
    try {
      // Step 1: Insert the song into the liked_songs table
      const insertQuery = `
        INSERT INTO liked_songs (user_id, song_id)
        VALUES (?, ?)
      `;

      const insertSuccess = await db.executeQuery(connection, insertQuery, [userId, songId]);

      if (insertSuccess.affectedRows > 0) {
        // Successfully liked the song
        resolve({
          message: 'Song liked successfully',
          body: {
            liked: true
          }
        });
      } else {
        reject({
          message: 'Failed to like song.',
        });
      }
    } catch (error) {
      console.log(`Unexpected: ${error}`);
      reject({
        message: 'Unexpected error'
      });
    } finally {
      // Ensure db connection is closed at the end
      db.closeConnection(connection);
    }
  });
};

/**
 * User unlikes a song
 * Remove a specific song from the list of liked songs for a user
 *
 * userId Integer ID of the user to remove the liked song from
 * songId Integer ID of the song to be removed from liked songs
 * no response value expected for this operation
 **/
exports.unlike_song = function(userId, songId) {
  return new Promise(async (resolve, reject) => {
    const connection = db.createConnection();
    try {
      // Step 1: Delete the song from the liked_songs table
      const deleteQuery = `
        DELETE FROM liked_songs
        WHERE user_id = ? AND song_id = ?
      `;

      const deleteSuccess = await db.executeQuery(connection, deleteQuery, [userId, songId]);

      if (deleteSuccess.affectedRows > 0) {
        // Successfully unliked the song
        resolve({
          message: 'Song unliked successfully.',
          body: {
            liked: false
          }
        });
      } else {
        reject({
          message: 'Failed to unlike the song.',
        });
      }
    } catch (error) {
      console.log(`Unexpected: ${error}`);
      reject({
        message: 'Unexpected error'
      });
    } finally {
      // Ensure db connection is closed at the end
      db.closeConnection(connection);
    }
  });
};


/**
 * Create a new playlist
 * Create a new playlist for a specific user
 *
 * body Playlist Playlist object to be created
 * userId Integer ID of the user to create the playlist for
 * returns Playlist
 **/
exports.create_user_playlist = function(body,userId) {
  return new Promise(async (resolve, reject) => {
    const connection = db.createConnection();
    try {

      const insertQuery = `
        INSERT INTO playlists (title, owner)
        VALUES (?, ?);
      `;
      const insertResult = await db.executeQuery(connection, insertQuery, [body.title, userId]);

      if (insertResult.affectedRows > 0) {
        // Successfully inserted the new playlist
        // Resolve with the data
        const newPlaylist = {
          // id: result.insertId,
          title: body.title,
          owner: userId,
          cover: null,  // Default null, could be added later
          edit_mode: false,  // Default value
          is_public: false,  // Default value
          created_at: new Date(),
          updated_at: new Date(),
        };

        resolve({
          message: 'Successfully created new playlist',
          body: newPlaylist,
          code: 201
        });
      } else {
        reject({
          message: 'Failed to create new playlist',
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      reject({
        message: 'Unexpected',
        code: 500
      })
    } finally {
      db.closeConnection(connection);
    }  
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
exports.follow_artist = function(artistId,userId) {
  return new Promise(async (resolve, reject) => {

    const connection = db.createConnection();
    try {
      //  Insert the artist into the followed artists table
      const insertQuery = `
        INSERT INTO followed_artists (user_id, artist_id)
        VALUES (?, ?)
      `;

      const insertSuccess = await db.executeQuery(connection, insertQuery, [userId, artistId]);

      if (insertSuccess.affectedRows > 0) {
        // Successfully followed the artist, update the artists followers 
        const updateQuery = `
          UPDATE artists
          SET followers = followers + 1
          WHERE id = ?
        `;

        const updateSuccess = await db.executeQuery(connection, updateQuery, [artistId]);

        if (updateSuccess.affectedRows > 0) {
          resolve({
            message: 'Artist followed successfully',
            body: {
              is_followed: true
            },
          });
        } else {
          // Roll back the insertion if the update failed
          const rollbackQuery = `
            DELETE 
            FROM folowed_artists
            WHERE
              user_id = ? AND artist_id = ?
          `;

          await db.executeQuery(connection, rollbackQuery, [userId, artistId]);

          reject({
            message:  'Failed to update followers count, rolled back follow operation.'
          })
        }
      } else {
        reject({
          message: 'Failed to follow artist.',
        });
      }
    } catch (error) {
      console.log(`Unexpected: ${error}`);
      reject({
        message: 'Unexpected error'
      });
    } finally {
      // Ensure db connection is closed at the end
      db.closeConnection(connection);
    }
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
exports.unfollow_artist = function(artistId,userId) {
  return new Promise(async (resolve, reject) => {
    const connection = db.createConnection();
    try {
      // Delete artist from followed artists table
      const deleteQuery = `
        DELETE 
        FROM followed_artists
        WHERE
          user_id = ? AND artist_id = ?
      `;

      const deleteSuccess = await db.executeQuery(connection, deleteQuery, [userId, artistId]);

      if (deleteSuccess.affectedRows > 0) {
        // Successfully deleted the artist from the table, now update their followers count
        const updateQuery = `
          UPDATE artists
          SET followers = GREATEST(followers - 1, 0)
          WHERE id = ?
        `;

        const updateSuccess = await db.executeQuery(connection, updateQuery, [artistId]);

        if (updateSuccess.affectedRows > 0) {
          resolve({
            message: 'Artist unfollowed successfully',
            body: {
              is_followed: false
            },
          });
        } else {
          // Roll back the delete if the update failed
          const rollbackQuery = `
            INSERT INTO followed_artists (user_id, artist_id)
            VALUES (?, ?)
          `;

          await db.executeQuery(connection, rollbackQuery, [userId, artistId]);

          reject({
            message:  'Failed to update followers count, rolled back follow operation.'
          })
        }
      } else {
        reject({
          message: 'Failed to unfollow artist.',
        });
      }
    } catch (error) {
      console.log(`Unexpected: ${error}`);
      reject({
        message: 'Unexpected error'
      });
    } finally {
      // Ensure db connection is closed at the end
      db.closeConnection(connection);
    }
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
  return new Promise(async (resolve, reject) => {
      const connection = db.createConnection();
      try {
        // Step 1: Find the users liked songs playlists id using the isLikedSongs flag
        const selectQuery = `
          SELECT
            id
          FROM playlists
          WHERE owner = ? AND isLikedSongs = true;
        `;

        const selectResult = await db.executeQuery(connection, selectQuery, [userId]);

        if (selectResult.length > 0) {
          // Step 2: Call the get_playlist_by_id service to retrieve the rest of the playlists data
          const playlistId = selectResult[0].id;

          get_playlist_by_id(userId, playlistId)
            .then(playlistResponse => {
              // Return the liked songs playlist data
              console.log(playlistResponse.body);
              resolve({
                message: 'Liked songs retrieved sucessfully',
                body: playlistResponse.body // Propagate the response from the service
              });
            })
            .catch(error => {
              // Propagate error response from the service, overwriting with the appropriate message
              console.error(error.message);
              reject({
                message: `Error fetching liked songs details`,
                code: 500
              });
            });
        } else {
          reject({
            message: 'No liked songs playlist found for this user',
            code: 404
          })
        }
      } catch (error) {
        console.error(`Error fetching liked songs: ${error}`);
        reject({
          message: 'Unexpected error fetching liked songs',
          code: 500
        });
      } finally {
        db.closeConnection(connection);
      }
  });
};


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
  return new Promise(async (resolve, reject) => {
    const connection = db.createConnection();
    try {
      const selectQuery = `
        SELECT
          playlists.id,
          playlists.title,
          playlists.created_at,
          playlists.updated_at,
          playlists.isLikedSongs,
          GROUP_CONCAT(COALESCE(playlist_songs.song_id, '')) AS song_ids
        FROM playlists
        LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
        WHERE owner = ?
        GROUP BY playlists.id
      `
      const selectResult = await db.executeQuery(connection, selectQuery, [userId]);

      if (selectResult.length > 0 ) {

        const playlists = selectResult.map(row => ({
          id: row.id,
          title: row.title,
          created_at: row.created_at,
          updated_at: row.updated_at,
          isLikedSongs: row.isLikedSongs,
          song_ids: row.song_ids ? row.song_ids.split(',').map(Number) : [] // Convert into an array of numbers
        }))

        resolve({
          message: "Playlists retrieved successfully.",
          body: playlists
        })
      } else {

        resolve({
          message: "No playlists found",
          code: 404
        })
      }
    } catch (error) {
      console.error(`Unexpected: ${error}`);
      reject({
        message: "Unexpected error"
      })
    } finally {
      db.closeConnection(connection);
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

    if (!connection) {
      return reject({ message: 'Database connection failed', code: 500 });
    }

    try {
      const userDetails = await db.callProcedure(
        connection,
        'login_user',
        [username],
        ['p_password_hash', 'p_user_id', 'p_success', 'p_message']
      );

      const [userId, passwordHash, success, message] = userDetails;

      if (success === 1 && passwordHash) {  // User exists in the database
        if (bcrypt.compareSync(password, passwordHash)) {
          const token = jwt.sign(
            {
              user_id: userId,
              username: username,
              exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1-hour expiry
            },
            process.env.JWT_SECRET_KEY,
            { algorithm: 'HS256' }
          );
          return resolve({ userId, username, token });
        } else {
          return reject({ message: 'Invalid username or password', code: 401 });
        }
      }

      // User not found
      return reject({ message: message || 'User not found', code: 404 });
    } catch (error) {
      return reject({ message: 'Internal server error', code: 500, details: error.message });
    } finally {
      db.closeConnection(connection);
    }
  });
};


/**
 * 
 * Logs out the current logged-in user session
 * 
 * @param {Object} body - The request body containing optional user information
 * @returns {Promise} Resolves with a success message or rejects with an error
 */
exports.logout_user = function(body) {
  return new Promise((resolve, reject) => {
    try {
      const username = body?.username;
      
      if (username) {
        console.info(`User ${username} logged out.`);
      }
      
      resolve({ message: 'Logout successful' , username});
    } catch (error) {
      reject({ message: 'Logout failed', code: 500, details: error.message });
    }
  });
};

/**
 * Handles the registration of a new user using a Promise-based approach.
 *
 * @function register_user
 * @param {Object} body - The request body containing user details.
 * @param {string} body.username - The user's username.
 * @param {string} body.password - The user's password.
 * @param {string} body.email - The user's email.
 * @param {string} [body.first_name] - The user's first name (optional).
 * @param {string} [body.last_name] - The user's last name (optional).
 * 
 * @returns {Promise<Object>} - Resolves with a success message and user details if registration is successful.
 */
exports.register_user = function(body) {
  return new Promise(async (resolve, reject) => {
    const { username, password, email, first_name, last_name } = body;

    const connection = db.createConnection();
    if (!connection) {
      return reject({ message: 'Database connection failed', code: 500 });
    }

    try {
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Call the database procedure for user registration
      const [p_success, p_message] = await db.callProcedure(
        connection,
        'register_user',
        [username, passwordHash, email, first_name, last_name],
        ['p_success', 'p_message']
      );

      if (p_success === 1) {
        // User registered successfully
        return resolve({
          message: p_message || 'User registered successfully',
          body: { username, email },
        });
      } else {
        // Registration failed due to conflict or other issues
        return reject({ message: p_message || 'Username or email already exists', code: 400 });
      }
    } catch (error) {
      console.error(`Registration error for user ${username}: ${error.message}`);
      return reject({ message: 'Internal server error', code: 500, details: error.message });
    } finally {
      db.closeConnection(connection);
    }
  });
};
