'use strict';


/**
 * Get artist songs
 * Retrieve the list of songs by a specific artist
 *
 * artistId Integer The ID of the artist
 * returns List
 **/
exports.get_artist_songs = function(artistId) {
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
 * Get artist by id
 * Retrieve information about a specific artist
 *
 * artistId Integer The ID of the artist to fetch
 * returns Artist
 **/
exports.gett_artist_by_id = function(artistId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "followers" : 5000,
  "songs" : [ null, null ],
  "name" : "Iron Maiden",
  "is_followed" : true,
  "id" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

