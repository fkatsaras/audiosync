const test = require('ava');
const { createServer } = require('../../index');
const { loginRequest, likeSongRequest, unlikeSongRequest, seedSongs, clearLikedSongs, clearSongs, seedArtists, seedLikedSongs, clearArtists, seedPlaylistSongs, clearPlaylistSongs } = require('../../utils/testUtils');

process.env.NODE_ENV = 'test';

let server;
const PORT = 4005;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await createServer(PORT);
    console.log(`Mock server for Like Tests running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
});

test.serial('Like song succeeds with valid user and song', async (t) => {
    //Arrange: Seed  DB with song data
    await clearArtists();
    await clearLikedSongs(2);
    await clearSongs();
    await seedArtists([
        { id: 5, name: 'Artist Five', followers: 100 }  // Artist should be there so we can seed a song in the db
    ]);
    await seedSongs([
        { id: 3, title: 'Song Three', artist_id: 5, album: 'Album lol', duration: 500, cover: null, is_playing: false } // Seed a song for the user to like
    ]);

    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser2', password: 'test_password' };
    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;
 
    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Response should contain a token');

    const userId = 2;   //**NOTE** This should normally be retrieved with a request

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
    await clearLikedSongs(2);
    await clearSongs();
});

test.serial('Unlike song succeeds with valid user and song', async (t) => {
    // Arrange seed DB with appropriate data
    await clearArtists();
    await clearLikedSongs(2);
    await clearSongs();
    await seedArtists([
        { id: 6, name: 'Artist Six', followers: 209 }
    ]);
    await seedSongs([
        { id: 4, title: 'Song Four', artist_id: 6, album: 'Album idk', duration: 505, cover: 'cover2.jpg', is_playing: false }
    ]);

    // Precondition: Ensure song is liked :
    await seedLikedSongs([
        { user_id: 2, song_id: 4 }
    ]);
    // ...and song is in the Lied Songs Playlist of the user
    await seedPlaylistSongs([
        { playlist_id: 11, song_id: 4, order: 1 }
    ]);

    // ..and song is in the Liked Songs Playlist
    // Arrange: Login as a test user:
    const validLoginData = { username: 'testuser2', password: 'test_password' };
    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Response should have a token');

    const userId = 2;    // **TODO** This would normally be retrieved using the session middleware

    // Act: Make the unlike request
    const songId = 4;   // **TODO** This would normally be retrieved using the session middleware
    const response = await unlikeSongRequest(PORT, token, userId, songId);

    // Assert: verify the response
    const body = JSON.parse(response.body);
    t.is(body.message, 'Song unliked successfully.');
    t.falsy(body.body.liked, 'Song should now be marked as unliked');

    // Cleanup: 
    await clearArtists();
    await clearLikedSongs(2);
    await clearPlaylistSongs(11);
    await clearSongs();
});
