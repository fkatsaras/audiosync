'use strict';

const db = require('../utils/dbUtils');
const spotify = require('../utils/spotify');
const SearchRepository = require('../data/repository/SearchRepository');
const SongsRepository = require('../data/repository/SongRepository');

/**
 *  Utility function sanitize a users search query string of whitespaces etc...
 */
function sanitizeQuery (query) {
  return `%${query.trim().replace(/\s+/g, ' ').toLowerCase()}%`; // Replace multiple spaces with a single space | Wildcard match
}
/**
 *  Utility function to check if every artist in a list has their profile picture set
 */
async function fetchProfilePictures(artists) {
  // Separate artists with/without pfps
  const artistsWithoutPfps = artists.filter(artist => !artist.profile_picture);

  if (artistsWithoutPfps.length === 0) return artists;

  const artistNames = artistsWithoutPfps.map(artist => artist.name);
  // Fetch missing pfps from Spotify
  const pfps = await Promise.all(
    artistNames.map(async (artist) => {
      try {
        const pfpUrl = await spotify.getArtistProfilePicture(artist);
        return { artist, pfpUrl };
      } catch (error) {
        console.error(`Failed to fetch pfp for artist: ${artist}`, error);
        return { artist, profile_picture: null };
      }
    })
  );

  const pfpMap = {};
  pfps.forEach(({ artist, pfpUrl }) => {
    pfpMap[artist.toLowerCase()] = pfpUrl;
  });

  artistsWithoutPfps.forEach(artist => {
    const pfpUrl = pfpMap[artist.name.toLowerCase()] || null;
    artist.profile_picture = pfpUrl;
  });

  return artists;
}

/**
 *  Utility function to check if every song in a list has its cover url set
 */
async function fetchMissingCovers(connection, songs) {
  const songsWithoutCovers = songs.filter(song => !song.cover);

  // If there are songs in the DB without a cover image URL
  if (songsWithoutCovers.length === 0) return songs;
   
  const missingAlbums = songsWithoutCovers.map(song => song.album);
  // Fetch missing covers
  const albumCovers = await Promise.all(
    missingAlbums.map(async (albumName) => {
      try {
        const coverUrl = await spotify.getSongCover(albumName); // Cal the spotify API to get song cover
        return { albumName, coverUrl }; 
      } catch (error) {
        console.error(`Failed to fetch cover for album: ${albumName}`, error);
        return { albumName, coverUrl: null };  
      }
    })
  );
  // Create a mapping of album names to their respective cover URLs
  const albumCoverMap = {};
  albumCovers.forEach(({ albumName, coverUrl }) => {
    albumCoverMap[albumName.toLowerCase()] = coverUrl;
  });
  // Update DB with fetched covers
  await Promise.all(
    songsWithoutCovers.map(async song => {
      const coverUrl = albumCoverMap[song.album.toLowerCase()] || null;
      if (coverUrl) {
        await SongsRepository.updateCover(connection, song.id, coverUrl);
      }
      song.cover = coverUrl;  // Add cover to song object
    })
  );

  return songsWithoutCovers;
}


/**
 * Search for artists
 * Retrieve search results for artists based on query.
 *
 * q String Search query string for artists. The query will be used to search for partial matches in artist names.
 * returns inline_response_200_1
 **/
exports.search_artists_get = async function(userId, userQuery, limit, offset) {
  const connection = db.createConnection();

  try {
    if (!userQuery || !userQuery.trim()) {
      throw {
        message: 'Search query is empty.',
        body : {
          artists: [],
          pagination: {
            limit,
            offset,
            count: 0,
          }
        },
        code: 400,
      };
    }  
    const sanitizedQuery = sanitizeQuery(userQuery);

    const results = await SearchRepository.searchArtists(connection, sanitizedQuery, limit, offset);

    if (results.length === 0) {
      throw {
        message: `No artists found for given query.`,
        body : {
          artists: [],
          pagination: {
            limit,
            offset,
            count: 0,
          }
        },
        code: 404, 
      };
    }

    const artistsWithPfps = results.filter(artist => artist.profile_picture);
    const artistsWithoutPfps = results.filter(artist => !artist.profile_picture);
    const artists = await fetchProfilePictures([...artistsWithPfps, ...artistsWithoutPfps]);

    return {
      message: `Artists successfully found by user ${userId}`,
      body:{
          artists,
          pagination: {
            limit,
            offset,
            count: artists.length,
          },
        }
    };
  } catch (error) {
    console.error('Error in searching artists:', error.message);
    if (error.code) throw error; // Re-throw expected errors without modification

    throw {
      message: 'Unexpected',
      code: 500,
    };
  } finally {
    db.closeConnection(connection);
  }
};

/**
 * Search for songs
 * Retrieve search results for songs based on query.
 *
 * q String Search query string for songs. The query will be used to search for partial matches in song titles.
 * returns inline_response_200_1
 **/
exports.search_songs_get = async function(userId, userQuery, limit, offset) {
  const connection = db.createConnection();
  try {
    if (!userQuery || !userQuery.trim()) {
      throw{
        message: 'Search query is empty.',
        code: 400,
      };
    }

    const query = sanitizeQuery(userQuery);

    // Execute query 
    const results = await SearchRepository.searchSongs(connection, query, limit, offset);

    if (results.length === 0) {
      throw {
        message: `No songs found for given query.`,
        code: 404, 
      };
    }

    // Separate songs with and witout covers
    const songsWithCovers = results.filter(song => song.cover);
    const songsWithoutCovers = await fetchMissingCovers(connection, results);
    // Combine results
    const allSongs = [...songsWithCovers, ...songsWithoutCovers];

    return {
      message: `Songs successfully found by user ${userId}`,
      body:{
          songs: allSongs.map(song => ({
            id: song.id,
            title: song.title,
            duration: song.duration,
            cover: song.cover,
          })),
          pagination: {
            limit,
            offset,
            count: allSongs.length,
          },
        }
    };

  } catch (error) {
    console.error('Error in searching songs:', error.message);
    if (error.code) throw error; // Re-throw expected errors without modification

    throw {
      message: 'Unexpected',
      code: 500,
    };
  } finally {
    db.closeConnection(connection);
  }
};