'use strict';

const db = require('../utils/dbUtils');
const escape = require('sqlstring').escape;  // For escaping special characters
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

      console.log(searchQuery) ;
      console.log([escapedQ, limit, offset]);

      // Execute query 
      const connection = db.createConnection();
      const results = await db.executeQuery(connection, searchQuery, [escapedQ, limit, offset]);

      if (results.length === 0) {
        return reject({
          message: `No artists found for query '${userQuery}'`,
          code: 404, 
        });
      }

      // Add profile pictures
      const artists = await Promise.all(
        results.map(async (artist) => {

          let profile_picture;
          try {
            // Query Spotify API for artist profile picture
            profile_picture = await spotify.getArtistProfilePicture(artist.name);
          } catch (error) {
            console.error(`Failed to fetch profile picture for artist ${artist.name}`)
          }

          return {
            id: artist.id,
            name: artist.name,
            profile_picture: profile_picture,
          };

        })
      );


      resolve({
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

