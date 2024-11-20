const test = require('ava');
const index = require('../../index');
const { loginRequest, searchRequest, seedSongs, seedArtists, clearSongs, clearArtists } = require('../utils');

process.env.NODE_ENV = 'test';


let server;
const PORT = 4004
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await index.createServer(PORT);
    console.log(`Mock server for Search tests running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
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
    t.is(body.message, `Songs successfully found by user testuser`);
    t.is(body.body.pagination.count, 2, 'Should return two songs');
    
    // Assert that the correct song titles are returned
    t.deepEqual(
        body.body.songs.map((song) => song.title),
        ['Song One', 'Song Two']
    );
});


