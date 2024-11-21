'use strict';

const db = require('../utils/dbUtils');
const Song = require('../models/Song');
const { getSongCover } = require('../utils/spotify');


/**
 * Get song by ID
 * Retrieve information about a specific song
 *
 * songId Integer The ID of the song to fetch
 * returns Song
 **/
exports.get_song_by_id = function(userId, songId) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = db.createConnection();

      const query = `
        SELECT songs.*, artists.name AS artist_name
        FROM songs
        JOIN artists ON songs.artist_id = artists.id
        WHERE songs.id = ?
      `;
      const songResult = await db.executeQuery(connection, query, [songId]);

      if (songResult.length > 0) {
        const songData = songResult[0];
        songData.artist = songData.artist_name;

        // Create a Song instance with the retrieved data
        const song = Song.fromDict(songData);

        // Fetch album cover and set it
        song.cover = await getSongCover(song.album);

        // Check if the song has been liked by the user
        const likeQuery = `
          SELECT 1 FROM liked_songs
          WHERE user_id = ? AND song_id = ?
        `;

        const likeResult = await db.executeQuery(connection, likeQuery, [userId, songId]);
        song.liked = Boolean(likeResult.length);

        // Respond with song data
        return resolve({
          message: 'Song retrieved successfully',
          body: song.toJSON()
        });

      } else {
        // Song not found 
        return reject({
          message: `Song with ID: ${songId} not found`,
          code: 404
        });
      }
    } catch (error) {
      console.error('Error in retrieving song:', error.message);
      reject({
        message: `Unexpected`,
        body: 500
      });
    }
  })
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

