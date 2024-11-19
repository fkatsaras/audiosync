const test = require('ava');
const got = require('got');
const http = require('http');
const index = require('../../index');
const db = require('../../utils/dbUtils');
const { connect } = require('http2');

let server;
const PORT = 4003
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await index.createServer(PORT);
    console.log(`Mock server for Search tests running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
});

// Helper function to perform login request
const loginRequest = async (credentials) => {
    return await got.post(`${BASE_URL}/api/v1/users/login`, {
        json: credentials,
        responseType: 'json',
        throwHttpErrors: false,
    });
};


// Helper function to add artists to the db for testing 
const seedArtists = async (artists) => {
    const connection = db.createConnection(true); // Connect to the test db

    const query = "INSERT INTO artists (id, name, followers) VALUES ?";
    const values = artists.map((artist) => [artist.id, artist.name, artist.followers]);

    return new Promise((resolve, reject) => {
        connection.query(query, [values], (err, results) => {
            if (err) {
                console.error(`Error seeding artists: ${err.message}`);
                reject(err);
            } else {
                console.log("Artists seeded successfully:", results);
                resolve(results);
            }
        });
    });
};
// Helper function to clear the test db
const clearArtists = async () => {
    const connection = db.createConnection(true);   // Connect to the test db
    await db.executeQuery(connection, "DELETE FROM artists WHERE name LIKE 'Artist%'");
};

test.serial('Search artists succeeds with valid query', async (t) => {
    
    // Arrange: Seed db with artists
    await clearArtists();
    await seedArtists([
        { id: 500, name: 'Artist One', followers: 0 },
        { id: 501, name: 'Artist Two', followers: 0 }
    ]);

    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');
    
    // Act : Perform the search request
    const searchQuery = 'artist';
    const limit = 10;
    const offset = 0;

    const response = await got(`${BASE_URL}/api/v1/search/artists`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        searchParams: {
            q: searchQuery,
            limit,
            offset,
        },
        responseType: 'json',
        throwHttpErrors: false
    });

    console.log(response.body);

    // Assert: Verify the response
    const body = response.body;
    t.is(body.code, 200);
    t.is(body.message, `Artists successfully found by user testuser`);
    t.is(body.body.pagination.count, 2, 'Should return two artists');
    t.deepEqual(
        body.body.artists.map((artist) => artist.name),
        ['Artist One', 'Artist Two']
    );
});

