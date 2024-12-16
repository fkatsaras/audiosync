'use strict';

const db = require('../utils/dbUtils');
const Song = require('../models/Song');
const { getSongCover } = require('../utils/spotify');
const { getYTSongAudioUrl } = require('../utils/youtubeUtils');


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

        // // Fetch the song info from youtube
        // const ytAudioUrl = await getYTSongAudioUrl(songData.title);
        // songData.audio_url = ytAudioUrl;

        // console.log(songData.audio_url);
        // Check if the audio_url is missing
        if (!songData.audio_url) {
          console.log(`Audio URL missing for song: ${songData.title}, Fetching from YouTube...`);
          const ytAudioUrl = await getYTSongAudioUrl(songData.title);

          if (ytAudioUrl) {
            songData.audio_url = ytAudioUrl;

            // Update the url in the db
            const updateAudioQuery = `
              UPDATE songs
              SET audio_url = ?
              WHERE id = ?
            `;

            await db.executeQuery(connection, updateAudioQuery, [ytAudioUrl, songId])
          } else {
            console.warn('Failed to fetch audio URL for song');
          }
        }

        // Check if the cover is null in the database
        if (!songData.cover) {
          console.log(`Cover missing for album: ${songData.album}. Fetching from Spotify...`);
          const coverUrl = await getSongCover(songData.album);

          if (coverUrl) {
            songData.cover = coverUrl;

            // Update the cover in the database
            const updateQuery = `
              UPDATE songs
              SET cover = ?
              WHERE id = ?
            `;
            await db.executeQuery(connection, updateQuery, [coverUrl, songId]);
          } else {
            console.warn(`Failed to fetch cover for album: ${songData.album}`);
          }
        }

        // Create a Song instance with the retrieved data
        const song = Song.fromObject(songData);

        // Check if the song has been liked by the user
        const likeQuery = `
          SELECT 1 FROM liked_songs
          WHERE user_id = ? AND song_id = ?
        `;

        const likeResult = await db.executeQuery(connection, likeQuery, [userId, songId]);
        song.liked = Boolean(likeResult.length);

        // Respond with song data
        return resolve({
          message: 'Song retrieved successfully.',
          body: song.toJSON()
        });

      } else {
        // Song not found 
        return reject({
          message: `Song with ID: ${songId} not found.`,
          code: 404
        });
      }
    } catch (error) {
      console.error('Error in retrieving song:', error.message);
      reject({
        message: error.message,
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

