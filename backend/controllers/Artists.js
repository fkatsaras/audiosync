'use strict';

var utils = require('../utils/writer.js');
var Artists = require('../service/ArtistsService.js');
const utils = require('../utils/writer.js');
const { successResponse, errorResponse } = require('../utils/apiUtils.js');
const Artists = require('../service/ArtistsService.js');
const { createConnection, executeQuery, closeConnection } = require('../utils/dbUtils.js');
const { get_album_cover, get_artist_profile_picture } = require('../utils/mediaUtils.js');

module.exports.get_artist_songs = function get_artist_songs (req, res, next, artistId) {
  Artists.get_artist_songs(artistId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_artist_by_id = async function get_artist_by_id(req, res, next, artistId) {
  const userId = req.user_id; 
  try {
    // Create DB connection
    const connection = createConnection();
    if (!connection) {
      return errorResponse(res, 'DB connection failed.', 500);
    }

    // Step 1: Fetch the artist details from the DB
    const artistQuery = "SELECT * FROM artists WHERE id = ?";
    const artistResult = await executeQuery(connection, artistQuery, [artistId]);

    if (artistResult && artistResult.length > 0) {
      const artistData = artistResult[0]; 

      // Step 2: Fetch the songs related to the artist from the DB
      const songsQuery = "SELECT * FROM songs WHERE artist_id = ?";
      const songsResult = await executeQuery(connection, songsQuery, [artistId]);

      // Step 3: Create Song objects
      const songs = songsResult.map(songData => {
        const song = Song.fromDict(songData);
        song.cover = get_album_cover(song.album);
        return song;
      });

      // Step 4: Check if the user follows this artist
      const followQuery = "SELECT 1 FROM followed_artists WHERE user_id = ? AND artist_id = ?";
      const followResult = await executeQuery(connection, followQuery, [userId, artistId]);

      const isFollowed = followResult.length > 0; // User follows this artist if result exists

      // Step 5: Create Artist object
      const artist = Artist.fromDict(artistData);
      artist.songs = songs;
      artist.isFollowed = isFollowed;

      // Fetch the artist's profile picture
      const profilePicture = get_artist_profile_picture(artist.name);
      artist.profilePicture = profilePicture;

      // Return success response
      return successResponse(res, 'Artist retrieved successfully', artist.toDict());
    } else {
      // Artist not found
      return errorResponse(res, `Artist with ID: ${artistId} not found.`, 404);
    }
  } catch (e) {
    // Handle any errors
    console.error(e);
    return errorResponse(res, `An error occurred while retrieving the artist: ${e.message}`, 500);
  } finally {
    // Close DB connection
    closeConnection(connection);
  }
};
