'use strict';

const db = require('../utils/dbUtils');
const Song = require('../models/Song');
const { getSongCover } = require('../utils/spotify');
const { fetchYoutubeAudio, isExpired, extractVideoId } = require('../utils/youtubeUtils');
const { getLyrics, searchSong } = require('../utils/genius')
const ErrorHandler = require('../middleware/ErrorHandler');
const SongsRepository = require('../data/repository/SongRepository');

const cleanSongTitle = (title) => {
  return title.replace(/\(.*?\)/g, '')  // Remove anything in parentheses
              .replace(/\[.*?\]/g, '')  // Remove anything in brackets
              .trim();                  // Trim extra spaces
};

// // TODO : Implement something more consistent than this
// function appendLyricsTimeStamps(formattedLyrics, totalDuration) {
//   // Flatten the lyrics into a single array of lines
//   const allLines = formattedLyrics.flatMap(section => {
//       const lines = section.text.split('\n').filter(line => line.trim() !== '');
//       return lines;
//   });

//   // Calculate the time for each line based on the total song duration
//   const timePerLine = totalDuration / allLines.length;

//   // Map each line to its respective timestamp
//   let timeElapsed = 0;
//   const timeStampedLyrics = formattedLyrics.map((section) => {
//       const { header, text } = section;
      
//       // Split the text into lines
//       const lines = text.split('\n').filter(line => line.trim() !== '');
      
//       // Map lines to their respective timestamps based on the total song duration
//       const timeStampedText = lines.map((line) => {
//           const time = timeElapsed.toFixed(2); // Get the current timestamp
//           timeElapsed += timePerLine; // Increase the time for the next line
//           return { time, line };
//       });

//       return { header, text: timeStampedText };
//   });

//   return timeStampedLyrics;
// }

// /**
//      *  Lyrics
//      * 
//      */
// const formatLyrics = (lyrics) => {

//   const formatSectionText = (text) => {
//       return  text.replace(/([a-z])([A-Z])/g, '$1\n$2');
//   };

//   const regex = /\[([^\]]+)\](.*?)(?=\[|\s*$)/g;
//   const sections = [];
//   let match;

//   /**
//    * Each call to exec() advances the search position.
//    * When a match is found, exec() updates the position 
//    * in the string to the next character after the match,
//    * so it won’t check the same part of the string repeatedly
//    * 
//    */

//   while ((match = regex.exec(lyrics)) !== null) {
//       const header = match[1].trim();
//       let text = match[2].trim();

//       text = formatSectionText(text);

//       sections.push({ header, text })
//   }

//   const formatted = sections.map((section, idx) => {
//       return (
//           {
//             header: section.header,
//             text: section.text
//           }
//       )
//   })

//   return formatted;
// }



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

        if (video_id) await SongsRepository.updateVideoId(connection, songId, extractVideoId(video_id));
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
};


exports.get_song_lyrics = async function (songId) {
  const connection = db.createConnection();

  try {
    // Fetch the song from the repository by its ID
    const songResult = await SongsRepository.getSongById(connection, songId);

    // Check if the song was found
    if (songResult.length === 0) {
      throw ErrorHandler.createError(404, `Song with ID: ${songId} not found`);
    }

    const songData = songResult[0];  // Get the first (and likely only) song object

    // Update lyrics if missing
    if (!songData.lyrics) {
      console.log(`Lyrics missing. Fetching from genius...`);
      const songGeniusUrl = await searchSong(cleanSongTitle(songData.title), songData.artist_name);
    
      if (songGeniusUrl) {
          const lyrics = await getLyrics(songGeniusUrl);
      
          // Check if the lyrics were successfully fetched
          if (lyrics) {
              console.log('Lyrics found. Updating the database...');
              songData.lyrics = lyrics;
              await SongsRepository.updateSongLyrics(connection, songId, lyrics);
          } else {
              console.error('Error scraping lyrics: Lyrics not found.');
          }
      } else {
          console.error('Error fetching Genius URL.');
      }
    }

    // Format the lyrics
    const formattedLyrics = formatLyrics(songData.lyrics);

    return {
      message: 'Lyrics fetched successfully.',
      body: { 
        lyricsAvailable: true,  // TODO : This should be in another function for lazy loading
        lyrics: appendLyricsTimeStamps(formattedLyrics, songData.duration)  // Append timestamps at the lyrics 
       }
    };

  } catch (error) {
    throw ErrorHandler.handle(error);
  } finally {
    db.closeConnection(connection);
  }
};