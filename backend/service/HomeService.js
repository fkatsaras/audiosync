'use strict';
const api = require('../utils/apiUtils');

'use strict';

/**
 * Get Home Page GUI
 * Retrieve the home page GUI data, including links to various user-related features.
 *
 * @param {string} current_user - The username extracted from the token.
 * @returns {Promise<Object>} - Resolves with the response body containing links, or rejects with an error.
 */
exports.home = function (current_user) {
  return new Promise((resolve, reject) => {
    if (!current_user) {
      return reject({ message: 'User is not authenticated!', code: 401 });
    }

    const links = {
      search: "/search",
      myArtists: `/users/${current_user}/my-artists`,
      myPlaylists: `/users/${current_user}/my-playlists`,
      likedSongs: `/users/${current_user}/liked-songs`,
      recommended: `/users/${current_user}/recommended`,
    };

    const responseBody = {
      links: links,
    };

    return resolve({
      message: `Home page links retrieved successfully for user: ${current_user}.`,
      body: responseBody,
    });
  });
};
