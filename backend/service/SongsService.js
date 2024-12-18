'use strict';

const db = require('../utils/dbUtils');
const Song = require('../models/Song');
const { getSongCover } = require('../utils/spotify');
const { getYTSongVideo, isExpired, extractVideoId } = require('../utils/youtubeUtils');


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
        // Check if the audio_url is missing or expired
        if (!songData.audio_url || isExpired(songData.audio_url)) {
          console.log(`Audio URL missing or expired for song: ${songData.title}. Fetching from YouTube...`);

          // If video_id exists, fetch the URL directly
          if (songData.video_id) {
            const [ytAudioUrl, fetchedVideoId] = await getYTSongVideo(null, null, songData.video_id);
            if (ytAudioUrl) {
              songData.audio_url = ytAudioUrl;

              // Update the URL in the database
              const updateAudioQuery = `
                UPDATE songs
                SET audio_url = ?
                WHERE id = ?
              `;
              await db.executeQuery(connection, updateAudioQuery, [ytAudioUrl, songId]);
            } else {
              console.warn(`Failed to regenerate audio URL for video ID: ${songData.video_id}`);
            }
          } else {
            // Fallback: Search by title if no video_id exists
            const [ytAudioUrl, fetchedVideoId] = await getYTSongVideo(songData.title, songData.artist_name, null);
            if (ytAudioUrl) {
              songData.audio_url = ytAudioUrl;

              // Extract and store video_id - cache the video Id which is constant
              const videoId = extractVideoId(fetchedVideoId);
              const updateQuery = `
                UPDATE songs
                SET audio_url = ?, video_id = ?
                WHERE id = ?
              `;
              await db.executeQuery(connection, updateQuery, [ytAudioUrl, videoId, songId]);
            } else {
              console.warn(`Failed to fetch audio URL for song: ${songData.title}`);
            }
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

