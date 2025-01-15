const test = require('ava');
const index = require('../../index');
const { loginRequest, seedArtists, clearArtists, getPlaylistRequest, seedPlaylistsWithSongs, clearPlaylistWithSongs, seedSongs } = require('../../utils/testUtils');

process.env.NODE_ENV = 'test';

let server;
const PORT = 4007;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await index.createServer(PORT);
    console.log(`Mock server for Playlist tests running on ${BASE_URL} `);
});

test.after.always(() => {
    if (server) server.close();
});

// Test for successful retrieval of Playlist
test.serial('Get playlist by ID succeeds with valid user and playlist', async (t) => {
    // Arrange: Seed DB with artists and playlists
    await clearPlaylistWithSongs(1);
    await clearArtists();
    await seedArtists([
        { id: 7, name: 'Artist Seven', followers: 100 }
    ]);
    await seedSongs([
        { id: 1, title: 'Song One', artist_id: 7, album: 'Album One', duration: 210, cover: null, is_playing: false },
        { id: 2, title: 'Song Two', artist_id: 7, album: 'Album Two', duration: 180, cover: 'cover2.jpg', is_playing: true },
    ]);
    // Mock playlist Data
    const mockPlaylists = [
        {
          id: 1,
          title: 'Chill Vibes',
          owner: 2, //user with ID 2 owns this playlist
          cover: 'chill-vibes-cover.jpg',
          is_public: true,
          songs: [
            { song_id: 1, order: 0 },
            { song_id: 2, order: 1 },
          ]
        }
        // {
        //   id: 2,
        //   title: 'Workout Hits',
        //   owner: 2,
        //   cover: 'workout-hits-cover.jpg',
        //   is_public: false,
        //   songs: [
        //     { song_id: 4, order: 0 },
        //     { song_id: 5, order: 1 },
        //     { song_id: 6, order: 2 }
        //   ]
        // }
    ];

    await seedPlaylistsWithSongs(mockPlaylists);

    // Arrange: Login as a test user
    const validLoginData = { username: 'testuser2', password: 'test_password' };
    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Response should contain a token');

    const userId = 2;

    // Act: Make the get playlist by ID request
    const getPlaylistResponse = await getPlaylistRequest(userId, 1, token, PORT);
    const body = getPlaylistResponse.body;

    console.log(body.songs);

    // Assert: Verify the response
    t.is(body.code, 200);
    t.is(body.message, 'Playlist retrieved successfully');
    t.is(body.body.id, 1);
    t.is(body.body.title, 'Chill Vibes');
    t.is(body.body.cover, 'chill-vibes-cover.jpg');

    // Cleanup
    await clearPlaylistWithSongs(1);
    await clearArtists();
})