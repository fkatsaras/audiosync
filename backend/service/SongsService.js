'use strict';


/**
 * Get song by ID
 * Retrieve information about a specific song
 *
 * songId Integer The ID of the song to fetch
 * returns Song
 **/
exports.get_song_by_id = function(songId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
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
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get play status of a song
 * Retrieve the current play status (playing or paused) of a specific song
 *
 * songId Integer ID of the song to retrieve play status for
 * returns inline_response_200
 **/
exports.get_song_play_status = function(songId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "is_playing" : true
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Toggle play/pause of a song
 * Start or pause playback of a specific song
 *
 * songId Integer ID of the song to toggle play/pause
 * no response value expected for this operation
 **/
exports.toggle_song_playback = function(songId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

