'use strict';

const Artist = require('../models/Artist');
const Song = require('../models/Song');
const db = require('../utils/dbUtils');
const { getSongCover, getArtistProfilePicture } = require('../utils/spotify');
const ErrorHandler = require('../middleware/ErrorHandler');
const ArtistRepository = require('../data/repository/ArtistRepository');


/**
 * Get artist by id
 * Retrieve information about a specific artist
 *
 * artistId Integer The ID of the artist to fetch
 * returns Artist
 **/
exports.get_artist_by_id = async function(userId, artistId) {
  const connection = db.createConnection();

  console.log(userId);

  try {
    // Step 1 : Fetch the artists details from the DB
    const artistResult = await ArtistRepository.getArtistById(connection, artistId);

    if (artistResult.length == 0) {
      throw ErrorHandler.createError(404, `Artist with ID: ${artistId} not found.`)
    }

    const artistData = artistResult[0];

    // Step 2: Fetch the artists songs
    const songsResult = await ArtistRepository.getSongsByArtistId(connection, artistId);
    const songs = await Promise.all(
      songsResult.map(async (songData) => {
        const song = Song.fromObject(songData); // Create a song instance
        try {
          song.cover = await getSongCover(song.album);
        } catch (error) {
          console.error(`Failed to fetch album cover for song ${song.title}`, error.message);
        }
        return song;
      })
    );

    // Step 3: Check if the user is following the artist
    const followResult = await ArtistRepository.isArtistFollowedByUser(connection, userId, artistId);

    console.log(followResult);
    const is_followed = Boolean(followResult.length);

    // Step 4: Create the artist object
    const artist = Artist.fromObject(artistData);
    artist.songs = songs;
    artist.is_followed = is_followed;

    // Step 5: Check and fetch artist's profile picture if missing
    if (!artist.profile_picture) {
      console.log(`Profile picture missing for artist: ${artist.name}, Fetching from Spotify...`);
      const artistPfp = await getArtistProfilePicture(artist.name);
      if (artistPfp) {
        artist.profile_picture = artistPfp;
        await ArtistRepository.updateProfilePicture(connection, artistId, artistPfp);
      } else {
        console.warn(`Failed to fetch profile picture for artist: ${artist.name}`);
      }
    }

    // Respond with the artist data
    return {
      message: 'Artist retrieved successfully.',
      body: artist.toJSON()
    };
  } catch (error) {
    throw ErrorHandler.handle(error);
  } finally {
    db.closeConnection(connection);
  }
}
