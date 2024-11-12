'use strict';


/**
 * Get Home Page GUI
 * Retrieve the home page GUI data, including links to various user-related features.
 *
 * current_user String The username extracted from the token.
 * returns HomePageResponse
 **/
exports.home = function(current_user) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "links" : {
    "search" : "/search",
    "myArtists" : "/users/{user-id}/my-artists",
    "myPlaylists" : "/users/{user-id}/my-playlists",
    "likedSongs" : "/users/{user-id}/liked-songs",
    "recommended" : "/users/{user-id}/recommended"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

