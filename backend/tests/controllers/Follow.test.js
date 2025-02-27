const test = require('ava');
const { createServer } = require('../../server');
const { loginRequest, seedArtists, seedFollowedArtists, clearArtists, clearFollowedArtists, followArtistRequest, unfollowArtistRequest } = require('../../utils/testUtils');

process.env.NODE_ENV = 'test';

let server;
const PORT = 4006;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async (t) => {
    t.timeout(2000);
    server = await createServer(PORT);
    console.log(`Mock server for Like Tests running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
});

test.serial('Follow artist succeeds with valid user and artist', async (t) => {
    //Arrange: Seed  DB with artist data
    await clearFollowedArtists(2);
    await clearArtists();
    await seedArtists([
        { id: 7, name: 'Artist Seven', followers: 100 }
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

    // Act: Make the artist like request
    const artistId = 7;   // **NOTE** This should normally be retrieved with a request
    const response = await followArtistRequest(PORT, token, userId, artistId);

    // Arrange: Verify the response
    const body = JSON.parse(response.body); // WTF
    console.log(body);
    t.is(body.message, 'Artist followed successfully');
    t.truthy(body.body.is_followed, 'Artist should be now marked as followed');

    // Cleanup:
    await clearFollowedArtists(2);
    await clearArtists();
});

test.serial('Unfollow artist succeeds with valid user and artist', async (t) => {
    // Arrange seed DB with appropriate data
    await clearFollowedArtists(2);
    await clearArtists();
    await seedArtists([
        { id: 8, name: 'Artist Eight', followers: 100 }
    ]);

    // Precondition: Ensure song is liked :
    await seedFollowedArtists([
        { artist_id: 8, user_id: 2 }
    ]);

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
    const artistId = 8;   // **TODO** This would normally be retrieved using the session middleware
    const response = await unfollowArtistRequest(PORT, token, userId, artistId);

    // Assert: verify the response
    const body = JSON.parse(response.body);
    t.is(body.message, 'Artist unfollowed successfully');
    t.falsy(body.body.is_followed, 'Artist should now be marked as unfollowed');

    // Cleanup: 
    await clearFollowedArtists(2);
    await clearArtists();
});
