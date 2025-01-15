const got = require('got');
const db = require('./dbUtils');
const BASE_URL = `http://localhost`;

const loginRequest = async (credentials, PORT) => {
    return await got.post(`${BASE_URL}:${PORT}/api/v1/users/login`, {
        json: credentials,
        responseType: 'json',
        throwHttpErrors: false,
    });
};

const logoutRequest = async (username, token, PORT) => {
    return await got.post(`${BASE_URL}:${PORT}/api/v1/users/logout`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        json: { username },
        responseType: 'json',
        throwHttpErrors: false
    });
};

const registerRequest = async (userData, PORT) => {
    return await got.post(`${BASE_URL}:${PORT}/api/v1/users/register`, {
        json: userData,
        responseType: 'json',
        throwHttpErrors: false
    });
};

const getUsernameFromToken = async (PORT, token) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/users/check-login`;
    const response = await got(URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'json',
        throwHttpErrors: false
    });
    
    const userId = response.session.user.id;
    return userId;
};

const getPlaylistRequest = async (userId, playlistId, token, PORT) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/users/${userId}/playlists?playlistId=${playlistId}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        responseType: 'json',
        throwHttpErrors: false
    }
    return await got(URL, options);
};

const searchRequest = async ( PORT, token, type, query, limit = 10, offset = 0) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/search/${type}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'json',
        throwHttpErrors: false
    }

    if (query) {
        options.searchParams = {
            q: query,
            limit,
            offset,
        };
    }
    
    return await got(URL, options);
};

const likeSongRequest = async (PORT, token, userId, songId) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/users/${userId}/liked-songs?songId=${songId}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
        },
    }

    return await got.post(URL, options);
}

const followArtistRequest = async (PORT, token, userId, artistId) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/users/${userId}/artists?artistId=${artistId}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
        },
    }

    return await got.post(URL, options);
}

const unlikeSongRequest = async (PORT, token, userId, songId) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/users/${userId}/liked-songs?songId=${songId}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
        },
    }

    return await got.delete(URL, options);
}

const unfollowArtistRequest = async (PORT, token, userId, artistId) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/users/${userId}/artists?artistId=${artistId}`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
        },
    }

    return await got.delete(URL, options);
}



// Helper function to seed data to the db for testing 
const seedData = async (tableName, columns, data) => {
    const connection = db.createConnection(); // Connect to the test db

    const query = `INSERT INTO ${tableName} (\`${columns.join('`, `')}\`) VALUES ?`;      // Using backticks to escape SQL keywords
    const values = data.map((row) => columns.map((col) => row[col]));
    console.log(query, values);

    return new Promise((resolve, reject) => {
        connection.query(query, [values], (err, results) => {
            if (err) {
                console.error(`Error seeding ${tableName}: ${err.message}`);
                db.closeConnection(connection);
                reject(err);
            } else {
                // console.log(`${tableName} seeded successfully:`, results);
                db.closeConnection(connection);
                resolve(results);
            }
        });
    });
};

// clearing helper function
const clearData = async (tableName, condition = '') => {
    const connection = db.createConnection(); // Connect to the test db

    const query = `DELETE FROM ${tableName} ${condition}`;
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                console.error(`Error clearing ${tableName}: ${err.message}`);
                db.closeConnection(connection);
                reject(err);
            } else {
                // console.log(`${tableName} cleared successfully:`, results);
                db.closeConnection(connection);
                resolve(results);
            }
        });
    });
};

// Specific seeding for Playlists
const seedPlaylists = async (users_playlists) => {
    try {
        return await seedData('playlists', ['id', 'title', 'owner', 'cover'], users_playlists)
    } catch (error) {
        console.log(`Failed to seedData in test DB: ${error.message}`);
        throw Error;
    }
}

const seedPlaylistSongs = async (data) => {
    try {
        return await seedData('playlist_songs', ['playlist_id', 'song_id', 'order'], data);
    } catch (error) {
        console.error(`Failed to seed playlist_songs with data: ${error}`);
        throw error;
    }
}

// Helper function to seed playlist data
const seedPlaylistsWithSongs = async (playlists) => {
  try {
      // Seed the playlists table
      await seedPlaylists(playlists.map(playlist => ({
          id: playlist.id,
          title: playlist.title,
          owner: playlist.owner,
          cover: playlist.cover,
          is_public: playlist.is_public
        })));
      // After seeding playlists, seed the playlist_songs table
      for (const playlist of playlists) {
        const playlistSongData = playlist.songs.map(song => ({
          playlist_id: playlist.id, // playlist_id
          song_id: song.song_id, // song_id
          order: song.order,     // order
      }));
      // Seed playlist_songs table
      await seedData('playlist_songs', ['playlist_id', 'song_id', 'order'], playlistSongData);
      }
    console.log('Playlists and songs seeded successfully');
  } catch (error) {
    console.log(`Failed to seed playlists and songs: ${error.message}`);
    throw error;
  }
};

// Specific clearing for artists
const clearArtists = async (artist_name_str='') => {
    try {
    return await clearData('artists', `WHERE name LIKE '${artist_name_str}%'`);
    } catch (error) {
    console.log(`Failed to clearData in test DB: ${error.message}`);
    throw Error;
    }
};


// Specific seeding for artists
const seedArtists = async (artists) => {
    try {
    return await seedData('artists', ['id', 'name', 'followers'], artists);
    } catch (error) {
    console.log(`Failed to seedData in test DB: ${error.message}`);
    throw Error;
    }
};

// Specific seeding for songs
const seedSongs = async (songs) => {
    try {
    return await seedData('songs', ['id', 'title', 'artist_id', 'album', 'duration', 'cover', 'is_playing'], songs);
    } catch (error) {
    console.log(`Failed to seedData in test DB: ${error.message}`);
    throw Error;
    }
};

const clearPlaylistSongs = async (playlistId) => {
    try {
        await clearData('playlist_songs', `WHERE playlist_id = ${playlistId}`);
    } catch (error) {
        console.error(`Failed to clear playlist_songs: ${error}`);
        throw error;
    }
}

// Helper function to clear playlist and its songs
const clearPlaylistWithSongs = async (playlistId) => {
    try {
      // First, delete the songs associated with the playlist from playlist_songs table
      await clearData('playlist_songs', `WHERE playlist_id = ${playlistId}`);
      
      // Then, delete the playlist itself
      await clearData('playlists', `WHERE id = ${playlistId}`);
      
      console.log(`Playlist with ID ${playlistId} and its songs cleared successfully`);
    } catch (error) {
      console.log(`Failed to clear playlist and its songs: ${error.message}`);
      throw error;
    }
  };

// Specific clearing for songs
const clearSongs = async (song_title_str) => {
    try {
    return await clearData('songs', `WHERE title LIKE '${song_title_str}%'`);
    } catch (error) {
    console.log(`Failed to clearData in test DB: ${error.message}`);
    throw Error;
    }
};

// Specific seeding for liked songs
const seedLikedSongs = async (users_songs) => {
    try {
    return await seedData('liked_songs', ['user_id', 'song_id'], users_songs);
    } catch (error) {
    console.log(`Failed to seedData in test DB: ${error.message}`);
    throw Error;
    }
};

// Specific seeding for followed artists
const seedFollowedArtists = async (users_artists) => {
    try {
    return await seedData('followed_artists', ['user_id', 'artist_id'], users_artists);
} catch (error) {
    console.log(`Failed to seedData in test DB: ${error.message}`);
    throw Error;
}
};

// Specific clearing for liked songs for specific user
const clearLikedSongs = async (user_id) => {
    try {
    return await clearData('liked_songs', `WHERE user_id = ${user_id}`);
    } catch (error) {
    console.log(`Failed to clearData in test DB: ${error.message}`);
    throw Error;
    }
};

// Specific clearing for liked songs for specific user
const clearFollowedArtists = async (user_id) => {
    try {
    return await clearData('followed_artists', `WHERE user_id = ${user_id}`);
    } catch (error) {
    console.log(`Failed to clearData in test DB: ${error.message}`);
    throw Error;
    }
};


module.exports = {
    loginRequest,
    logoutRequest,
    registerRequest,
    searchRequest,
    seedArtists,
    seedSongs,
    clearArtists,
    clearSongs,
    clearLikedSongs,
    getUsernameFromToken,
    likeSongRequest,
    unlikeSongRequest,
    followArtistRequest,
    seedFollowedArtists,
    clearFollowedArtists,
    unfollowArtistRequest,
    seedLikedSongs,
    getPlaylistRequest,
    seedPlaylistsWithSongs,
    clearPlaylistWithSongs,
    seedPlaylists,
    clearPlaylistSongs,
    seedPlaylistSongs
}
