'use strict';

const Artist = require('../models/Artist');
const Song = require('../models/Song');
const db = require('../utils/dbUtils');
const { getSongCover, getArtistProfilePicture } = require('../utils/spotify');


/**
 * Get artist songs
 * Retrieve the list of songs by a specific artist
 *
 * artistId Integer The ID of the artist
 * returns List
 **/
exports.get_artist_songs = function(artistId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
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
}, {
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
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get artist by id
 * Retrieve information about a specific artist
 *
 * artistId Integer The ID of the artist to fetch
 * returns Artist
 **/
exports.get_artist_by_id = function(userId, artistId) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = db.createConnection();

      const query = `
        SELECT *
        FROM artists
        WHERE id = ?
      `;

      // Step 1: Fetch the artists details from the DB
      const artistResult = await db.executeQuery(connection, query, [artistId]);

      if (artistResult.length > 0) {
        const artistData = artistResult[0];
        
        // Step 2: Fetch the artists songs from the DB
        const songsQuery = `
          SELECT *
          FROM songs
          WHERE artist_id = ?
        `;

        const songsResult = await db.executeQuery(connection, songsQuery, [artistId]);

        const songs = await Promise.all(
          songsResult.map(async (songData) => {
            const song = Song.fromObject(songData); // Create a song instance
            try {
              song.cover = await getSongCover(song.album);
            } catch (error) {
              console.error(`Failed to fetch album cover for song ${song.title}`);
            }
            return song;
          })
        );

        // Step 4: Check if the user is already following the artist
        const followQuery = `
          SELECT 1
          FROM followed_artists
          WHERE 
            user_id = ? AND artist_id = ?
        `;

        const followResult = await db.executeQuery(connection, followQuery, [userId, artistId]);
        const is_followed = Boolean(followResult.length);

        // Step 5: Create the artist obj
        const artist = Artist.fromObject(artistData);
        artist.songs = songs; 
        artist.is_followed = is_followed;

        // Step 6: Check if the artists pfp is stored
        if (!artist.profile_picture) {
          console.log(`Profile picture missing for artist: ${artist.name}, Fetching from Spotify...`);
          const artistPfp = await getArtistProfilePicture(artist.name); // Fetch from spotify

          if (artistPfp) {
            artist.profile_picture = artistPfp;

            const updateQuery = `
              UPDATE artists
              SET profile_picture = ?
              WHERE id = ?
            `;
            await  db.executeQuery(connection, updateQuery, [artistPfp, artistId]);
          } else {
            console.warn(`Failed to fetch profile picture for artist: ${artist.name}`)
          }

        }
        // Respond with artist data
        return resolve({
          message: 'Artist retrieved successfully.',
          body: artist.toJSON()
        })
      } else {
        // Artist not found
        return reject({
          message: `Artist with ID: ${artistId} not found.`,
          code: 404
        });
      }
    } catch (error) {
      console.error('Error in retrieving artist:', error.message);
      reject({
        message: error.message,
        code: 500
      })
    }
  });
}

