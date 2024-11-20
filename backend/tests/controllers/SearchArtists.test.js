const test = require('ava');
const index = require('../../index');
const { loginRequest, searchRequest, seedArtists, clearArtists } = require('../utils');

process.env.NODE_ENV = 'test';


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
    t.is(body.message, `Artists successfully found by user testuser`);
    t.is(body.body.pagination.count, 2, 'Should return two artists');
    t.deepEqual(
        body.body.artists.map((artist) => artist.name),
        ['Artist One', 'Artist Two']
    );
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
})

