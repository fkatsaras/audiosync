'use strict';


/**
 * Search for artists
 * Retrieve search results for artists based on query.
 *
 * q String Search query string for artists. The query will be used to search for partial matches in artist names.
 * returns inline_response_200_1
 **/
exports.search_artists_get = function(q) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "message",
  "body" : {
    "artists" : [ {
      "name" : "name",
      "profile_picture" : "profile_picture",
      "id" : 0
    }, {
      "name" : "name",
      "profile_picture" : "profile_picture",
      "id" : 0
    } ]
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

