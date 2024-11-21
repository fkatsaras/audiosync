const got = require('got');
const test = require('ava');
const db = require('../utils/dbUtils');
const BASE_URL = `http:localhost`;

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

// Helper function to seed data to the db for testing 
const seedData = async (tableName, columns, data) => {
    const connection = db.createConnection(); // Connect to the test db

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ?`;
    const values = data.map((row) => columns.map((col) => row[col]));

    return new Promise((resolve, reject) => {
        connection.query(query, [values], (err, results) => {
            if (err) {
                console.error(`Error seeding ${tableName}: ${err.message}`);
                reject(err);
            } else {
                console.log(`${tableName} seeded successfully:`, results);
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
                reject(err);
            } else {
                console.log(`${tableName} cleared successfully:`, results);
                resolve(results);
            }
        });
    });
};

// Specific seeding for artists
const seedArtists = async (artists) => {
    return seedData('artists', ['id', 'name', 'followers'], artists);
};

// Specific seeding for songs
const seedSongs = async (songs) => {
    return seedData('songs', ['id', 'title', 'artist_id', 'album', 'duration', 'cover', 'is_playing'], songs);
};

// Specific clearing for artists
const clearArtists = async () => {
    return clearData('artists', "WHERE name LIKE 'Artist%'");
};

// Specific clearing for songs
const clearSongs = async () => {
    return clearData('songs', "WHERE title LIKE 'Song%'");
};


module.exports = {
    loginRequest,
    logoutRequest,
    registerRequest,
    searchRequest,
    seedArtists,
    seedSongs,
    clearArtists,
    clearSongs
}
