'use strict';

const db = require('../utils/dbUtils');
const spotify = require('../utils/spotify');


/**
 * Search for artists
 * Retrieve search results for artists based on query.
 *
 * q String Search query string for artists. The query will be used to search for partial matches in artist names.
 * returns inline_response_200_1
 **/
exports.search_artists_get = function(userId, userQuery, limit, offset) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userQuery || !userQuery.trim()) {
        return reject({
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
        });
      }

      // Clean up the user query
      userQuery = userQuery.trim();
      userQuery = userQuery.replace(/\s+/g,' ');  // Replace multiple spaces with a single space
      const escapedQ = `%${userQuery.toLowerCase()}%`;  // Wildcard match

      // SQL query
      const searchQuery = `
        SELECT id, name
        FROM artists
        WHERE LOWER(name) LIKE ?
        LIMIT ? OFFSET ?
      `;

      // Execute query 
      const connection = db.createConnection();
      const results = await db.executeQuery(connection, searchQuery, [escapedQ, limit, offset]);

      if (results.length === 0) {
        return reject({
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
        });
      }

      // Separate artists with/without pfps
      // Separate songs with and witout covers
      const artistsWithPfps = results.filter(artist => artist.profile_picture);
      const artistsWithoutPfps = results.filter(artist => !artist.profile_picture);

      console.log(artistsWithoutPfps);

      // If there are artists without profile picture image URLs in the DB
      if (artistsWithoutPfps.length > 0) {
        const artistNames = artistsWithoutPfps.map(artist => artist.name);

        // Fetch missing pfps
        const pfps = await Promise.all(
          artistNames.map(async (artist) => {
            try {
              const pfpUrl = await spotify.getArtistProfilePicture(artist);
              return { artist, pfpUrl };
            } catch (error) {
              console.error(`Failed to fetch pfp for artist: ${artist}`, error);
              return { artist, profile_picture: null }
            }
          })
        );

        // Create a map between artist name and their pfp urls
        const pfpMap = {};
        pfps.forEach(({ artist, pfpUrl }) => {
          pfpMap[artist.toLowerCase()] = pfpUrl;
        });

        artistsWithoutPfps.forEach(artist => {
          const pfpUrl = pfpMap[artist.name.toLowerCase()] || null;
          artist.profile_picture = pfpUrl;
        });
      }

      // Combine artists with/without pfpfs
      const artists = [...artistsWithPfps, ...artistsWithoutPfps];

      resolve({
        message: `Artists successfully found by user ${userId}`,
        body:{
            artists,
            pagination: {
              limit,
              offset,
              count: artists.length,
            },
          }
      });
    } catch (error) {
      console.error('Error in searching artists:', error.message);
      reject({
        message: 'Unexpected',
        code: 500,
      });
    }
  });
}

exports.search_songs_get = function(userId, userQuery, limit, offset) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userQuery || !userQuery.trim()) {
        return reject({
          message: 'Search query is empty.',
          code: 400,
        });
      }

      // Clean up the user query
      userQuery = userQuery.trim();
      userQuery = userQuery.replace(/\s+/g,' ');  // Replace multiple spaces with a single space
      const escapedQ = `%${userQuery.toLowerCase()}%`;  // Wildcard match

      // SQL query
      const searchQuery = `
        SELECT *
        FROM songs
        WHERE LOWER(title) LIKE ?
        LIMIT ? OFFSET ?
      `;

      // Execute query 
      const connection = db.createConnection();
      const results = await db.executeQuery(connection, searchQuery, [escapedQ, limit, offset]);

      if (results.length === 0) {
        return reject({
          message: `No songs found for given query.`,
          code: 404, 
        });
      }

      // Separate songs with and witout covers
      const songsWithCovers = results.filter(song => song.cover);
      const songsWithoutCovers = results.filter(song => !song.cover);

      // If there are songs in the DB without a cover image URL
      if (songsWithoutCovers.length > 0) {
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
              const updateQuery = `
                UPDATE songs SET cover = ? WHERE id = ?
              `;

              await db.executeQuery(connection, updateQuery, [coverUrl, song.id]);
            }

            song.cover = coverUrl;  // Add cover to song object
          })
        );
      }

      // Combine results
      const allSongs = [...songsWithCovers, ...songsWithoutCovers];

      resolve({
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
      });

    } catch (error) {
      console.error('Error in searching songs:', error.message);
      reject({
        message: 'Unexpected',
        code: 500,
      });
    }
  });
}


