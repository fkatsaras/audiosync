'use strict';


/**
 * Search for songs
 * Retrieve search results for songs based on the user's query.
 *
 * user_query String Search query string for songs.
 * userId String The ID of the user making the search. (optional)
 * returns inline_response_200_2
 **/
exports.apiV1SearchSongsGET = function(user_query,userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "message",
  "body" : {
    "songs" : [ {
      "duration" : "duration",
      "album" : "album",
      "id" : 0,
      "title" : "title"
    }, {
      "duration" : "duration",
      "album" : "album",
      "id" : 0,
      "title" : "title"
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

