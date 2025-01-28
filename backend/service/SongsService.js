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
exports.get_song_by_id = async function (userId, songId) {
  const connection = db.createConnection();

  try  {

    const songResult = await SongsRepository.getSongById(connection, songId);

    if (songResult.length === 0) {
      throw ErrorHandler.createError(404, `Song with ID: ${songId} not found`);
    }

    const songData = songResult[0];

    songData.artist = songData.artist_name;

    // Update audio URL if missing or expired
    if (!songData.audio_url || isExpired(songData.audio_url)) {
      console.log(`Audio URL missing or expired for song: ${songData.title}. Fetching from YouTube...`);
      const ytAudioInfo = await fetchYoutubeAudio(songData);
      console.log(ytAudioInfo);

      if (ytAudioInfo) {
        const { audioUrl, video_id } = ytAudioInfo;
        songData.audio_url = audioUrl;
        
        await SongsRepository.updateAudioUrl(connection, songId, audioUrl);

        if (video_id) await SongsRepository.updateVideoId(connection, songId, video_id);
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