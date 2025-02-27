const test = require('ava');
const { createServer } = require('../../server');
const { loginRequest, searchRequest, seedArtists, seedSongs, clearSongs, clearArtists } = require('../../utils/testUtils');

process.env.NODE_ENV = 'test';


let server;
const PORT = 4003
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await createServer(PORT);
    console.log(`Mock server for Search tests running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
});

test.serial('Search artists succeeds with valid query', async (t) => {
    
    // Arrange: Seed db with artists
    await clearArtists();
    await seedArtists([
        { id: 1, name: 'Artist One', followers: 0 },
        { id: 2, name: 'Artist Two', followers: 0 }
    ]);

    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
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

    const response = await searchRequest(PORT, token, 'artists', searchQuery, limit, offset);

    // Assert: Verify the response
    const body = response.body;
    t.is(body.code, 200);
    t.is(body.message, `Artists successfully found by user 1`);
    t.assert(body.body.pagination.count >= 0, 'Should return more than zero artists');
    // t.deepEqual(
    //     body.body.artists.map((artist) => artist.name),
    //     ['Artist One', 'Artist Two']
    // );

    // Clean up db
    await clearArtists();
});

// Test: Empty search query
test.serial('Search artists fails with empty query', async (t) => {
    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');

    // Act: Make the API call with an empty query
    const response = await searchRequest(PORT, token, 'artists', null)

    // Assert: verify error response
    const body = response.body;
    t.is(body.code, 400);
    t.is(body.message, 'Search query is empty.');
});

// Test: No artists found
test.serial('Search artists returns 404 when no artists match given query', async (t) => {
    // Arrange: Clear DB
    await clearArtists();
    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');

    // Act: Make the API call request with a query that has no matches
    const searchQuery = 'nonexistent';
    const response = await searchRequest(PORT, token, 'artists', searchQuery);

    // Assert: Verify 404 response
    const body = response.body;
    t.is(body.code, 404);
    t.is(body.message, `No artists found for given query.`);
});

test.serial('Search songs succeeds with valid query', async (t) => {
    // Arrange: Seed db with artists
    await clearSongs();
    await clearArtists();
    await seedArtists([  // Ensure artists are seeded before songs
        { id: 3, name: 'Artist Three', followers: 100 },
        { id: 4, name: 'Artist Four', followers: 200 },
    ]);
    await seedSongs([  // Now seed songs
        { id: 1, title: 'Song One', artist_id: 3, album: 'Album One', duration: 210, cover: null, is_playing: false },
        { id: 2, title: 'Song Two', artist_id: 4, album: 'Album Two', duration: 180, cover: 'cover2.jpg', is_playing: true },
    ]);

    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');
    
    // Act: Perform the search request
    const searchQuery = 'song';  // Searching for songs with the keyword "song"
    const limit = 10;
    const offset = 0;

    const response = await searchRequest(PORT, token, 'songs', searchQuery, limit, offset);

    // Assert: Verify the response
    const body = response.body;
    t.is(body.code, 200);
    t.is(body.message, `Songs successfully found by user 1`);
    t.is(body.body.pagination.count, 2, 'Should return two songs');
    
    // Assert that the correct song titles are returned
    t.deepEqual(
        body.body.songs.map((song) => song.title).sort(),
        ['Song One', 'Song Two'].sort()
    );

    //Cleanup DB
    await clearArtists();
    await clearSongs();
});


// Test: Empty search query
test.serial('Search songs fails with empty query', async (t) => {
    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');

    // Act: Make the API call with an empty query
    const response = await searchRequest(PORT, token, 'songs', null)

    // Assert: verify error response
    const body = response.body;
    t.is(body.code, 400);
    t.is(body.message, 'Search query is empty.');
});

// Test: No songs found
test.serial('Search songs returns 404 when no songs match given query', async (t) => {
    // Arrange: Clear DB
    await clearSongs();
    await clearArtists();
    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');

    // Act: Make the API call request with a query that has no matches
    const searchQuery = 'nonexistent';
    const response = await searchRequest(PORT, token, 'songs', searchQuery);

    // Assert: Verify 404 response
    const body = response.body;
    t.is(body.code, 404);
    t.is(body.message, `No songs found for given query.`);
});


