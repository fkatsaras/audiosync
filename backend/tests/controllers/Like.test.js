const test = require('ava');
const index = require('../../index');
const { loginRequest, likeSongRequest, seedSongs, clearLikedSongs, clearSongs, seedArtists, getUsernameFromToken, clearArtists } = require('../../utils/testUtils');

process.env.NODE_ENV = 'test';

let server;
const PORT = 4005;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await index.createServer(PORT);
    console.log(`Mock server for Like Tests running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
});

test.serial('Like song succeeds with valid user and song', async (t) => {
    //Arrange: Seed  DB with song data
    await clearArtists();
    await clearLikedSongs(1);
    await clearSongs();
    await seedArtists([
        { id: 5, name: 'Artist Five', followers: 100 }
    ]);
    await seedSongs([
        { id: 3, title: 'Song Three', artist_id: 5, album: 'Album lol', duration: 500, cover: null, is_playing: false }
    ]);

    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser', password: 'test_password' };
    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;
 
    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Response should contain a token');

    const userId = 1;   //**NOTE** This should normally be retrieved with a request

    // Act: Make the song like request
    const songId = 3;   // **NOTE** This should normally be retrieved with a request
    const response = await likeSongRequest(PORT, token, userId, songId);

    // Arrange: Verify the response
    const body = JSON.parse(response.body); // WTF
    console.log(body);
    t.is(body.message, 'Song liked successfully');
    t.truthy(body.body.liked, 'Song should be now marked as liked');

    // Cleanup:
    await clearArtists();
});

