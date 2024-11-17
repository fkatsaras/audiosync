'use strict';
const api = require('../utils/apiUtils');

/**
 * Get Home Page GUI
 * Retrieve the home page GUI data, including links to various user-related features.
 *
 * current_user String The username extracted from the token.
 * res Object The response object for sending the response.
 **/
exports.home = function (current_user, res) {
  if (!current_user) {
    return api.errorResponse(res, 'User is not authenticated!', 401);
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

  return api.successResponse(
    res,
    `Home page links retrieved successfully for user: ${current_user}.`,
    responseBody
  );
};