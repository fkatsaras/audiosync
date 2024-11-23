const got = require('got');
const test = require('ava');
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

// Helper function to seed data to the db for testing 
const seedData = async (tableName, columns, data) => {
    const connection = db.createConnection(); // Connect to the test db

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ?`;
    const values = data.map((row) => columns.map((col) => row[col]));

    return new Promise((resolve, reject) => {
        connection.query(query, [values], (err, results) => {
            if (err) {
                console.error(`Error seeding ${tableName}: ${err.message}`);
                db.closeConnection(connection);
                reject(err);
            } else {
                console.log(`${tableName} seeded successfully:`, results);
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
                console.log(`${tableName} cleared successfully:`, results);
                db.closeConnection(connection);
                resolve(results);
            }
        });
    });
};

// Specific seeding for artists
const seedArtists = async (artists) => {
    try {
    return await seedData('artists', ['id', 'name', 'followers'], artists);
} catch (error) {
    console.log(`Failed to seedData in test DB`);
    throw Error;
}
};

// Specific seeding for songs
const seedSongs = async (songs) => {
    try {
    return await seedData('songs', ['id', 'title', 'artist_id', 'album', 'duration', 'cover', 'is_playing'], songs);
} catch (error) {
    console.log(`Failed to seedData in test DB`);
    throw Error;
}
};

// Specific clearing for artists
const clearArtists = async () => {
    try {
    return await clearData('artists', "WHERE name LIKE 'Artist%'");
} catch (error) {
    console.log(`Failed to clearData in test DB`);
    throw Error;
}
};

// Specific clearing for songs
const clearSongs = async () => {
    try {
    return await clearData('songs', "WHERE title LIKE 'Song%'");
} catch (error) {
    console.log(`Failed to clearData in test DB`);
    throw Error;
}
};

// Specific clearing for liked songs for specific user
const clearLikedSongs = async (user_id) => {
    try {
    return await clearData('liked_songs', `WHERE user_id = ${user_id}`);
} catch (error) {
    console.log(`Failed to clearData in test DB`);
    throw Error;
}
}


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
    likeSongRequest
}
