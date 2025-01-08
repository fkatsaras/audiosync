'use strict';

const db = require('../utils/dbUtils');
const Song = require('../models/Song');
const { getSongCover } = require('../utils/spotify');
const { fetchYoutubeAudio, isExpired, extractVideoId } = require('../utils/youtubeUtils');
const ErrorHandler = require('../middleware/ErrorHandler');
const SongsRepository = require('../data/repository/SongRepository');


/**
 * Get song by ID
 * Retrieve information about a specific song
 *
 * songId Integer The ID of the song to fetch
 * returns Song
 **/
// exports.get_song_by_id = async function(userId, songId) {
//   try {
//     const connection = db.createConnection();
//     const query = `
//       SELECT songs.*, artists.name AS artist_name
//       FROM songs
//       JOIN artists ON songs.artist_id = artists.id
//       WHERE songs.id = ?
//     `;
//     const songResult = await db.executeQuery(connection, query, [songId]);
//     if (songResult.length > 0) {
//       const songData = songResult[0];
//       songData.artist = songData.artist_name;
//       // Check if the audio_url is missing or expired
//       if (!songData.audio_url || isExpired(songData.audio_url)) {
//         console.log(`Audio URL missing or expired for song: ${songData.title}. Fetching from YouTube...`);
//         // If video_id exists, fetch the URL directly
//         if (songData.video_id) {
//           const [ytAudioUrl, fetchedVideoId] = await getYTSongVideo(null, null, songData.video_id);
//           if (ytAudioUrl) {
//             songData.audio_url = ytAudioUrl;
//             // Update the URL in the database
//             const updateAudioQuery = `
//               UPDATE songs
//               SET audio_url = ?
//               WHERE id = ?
//             `;
//             await db.executeQuery(connection, updateAudioQuery, [ytAudioUrl, songId]);
//           } else {
//             console.warn(`Failed to regenerate audio URL for video ID: ${songData.video_id}`);
//           }
//         } else {
//           // Fallback: Search by title if no video_id exists
//           const [ytAudioUrl, fetchedVideoId] = await getYTSongVideo(songData.title, songData.artist_name, null);
//           if (ytAudioUrl) {
//             songData.audio_url = ytAudioUrl;
//             // Extract and store video_id - cache the video Id which is constant
//             const videoId = extractVideoId(fetchedVideoId);
//             const updateQuery = `
//               UPDATE songs
//               SET audio_url = ?, video_id = ?
//               WHERE id = ?
//             `;
//             await db.executeQuery(connection, updateQuery, [ytAudioUrl, videoId, songId]);
//           } else {
//             console.warn(`Failed to fetch audio URL for song: ${songData.title}`);
//           }
//         }
//       }
//       // Check if the cover is null in the database
//       if (!songData.cover) {
//         console.log(`Cover missing for album: ${songData.album}. Fetching from Spotify...`);
//         const coverUrl = await getSongCover(songData.album);
//         if (coverUrl) {
//           songData.cover = coverUrl;
//           // Update the cover in the database
//           const updateQuery = `
//             UPDATE songs
//             SET cover = ?
//             WHERE id = ?
//           `;
//           await db.executeQuery(connection, updateQuery, [coverUrl, songId]);
//         } else {
//           console.warn(`Failed to fetch cover for album: ${songData.album}`);
//         }
//       }
//       // Create a Song instance with the retrieved data
//       const song = Song.fromObject(songData);
//       // Check if the song has been liked by the user
//       const likeQuery = `
//         SELECT 1 FROM liked_songs
//         WHERE user_id = ? AND song_id = ?
//       `;
//       const likeResult = await db.executeQuery(connection, likeQuery, [userId, songId]);
//       song.liked = Boolean(likeResult.length);
//       // Respond with song data
//       return {
//         message: 'Song retrieved successfully.',
//         body: song.toJSON()
//       };
//     } else {
//       // Song not found 
//       throw {
//         message: `Song with ID: ${songId} not found.`,
//         code: 404
//       };
//     }
//   } catch (error) {
//     if (error.code) throw error; // Re-throw expected errors without modification

//     console.error('Error in retrieving song:', error.message);
//     throw {
//       message: error.message,
//       body: 500
//     };
//   }
// }
exports.get_song_by_id = async function (userId, songId) {
  const connection = db.createConnection();

  try  {

    const songResult = await SongsRepository.getSongById(connection, songId);

    if (songResult.length === 0) {
      throw ErrorHandler.createError(404, `Song with ID: ${songId} not found`);
    }

    const songData = songResult[0];
    songData.artist = songResult.artist_name;

    // Update audio URL if missing or expired
    if (!songData.audio_url || isExpired(songData.audio_url)) {
      console.log(`Audio URL missing or expired for song: ${songData.title}. Fetching from YouTube...`);
      const ytAudioInfo = await fetchYoutubeAudio(songData);

      if (ytAudioInfo) {
        const { audioUrl, videoId } = ytAudioInfo;
        songData.audio_url = audioUrl;
        
        await SongsRepository.updateAudioUrl(connection, songId, audioUrl);

        if (videoId) await SongsRepository.updateVideoId(connection, songId, videoId);
      }
    }

    // Update cover if missing
    if (!songData.cover) {
      console.log(`Cover missing for album: ${songData.album}. Fetching from Spotify...`);
      const coverUrl = await getSongCover(songData.album);

      if (coverUrl) {
        songData.cover = coverUrl;
        
        await SongsRepository.updateCover(connection, songId, coverUrl);
      }
    }

    // Create a Song instance
    const song = Song.fromObject(songData);

    // Check if the song has been liked by the user
    const likeResult = await SongsRepository.isSongLikedByUser(connection, userId, songId);
    song.liked = Boolean(likeResult.length);

    // Return the song data
    return {
      message: 'Song retrieved successfully.',
      body: song.toJSON(),
    };

  } catch (error) {
    throw ErrorHandler.handle(error);
  } finally {
    db.closeConnection(connection);
  }
  
}