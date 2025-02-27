const test = require('ava');
const got = require('got');
const { createServer } = require('../../server');
const { loginRequest, logoutRequest } = require('../../utils/testUtils');

process.env.NODE_ENV = 'test';


let server;
const PORT = 4002;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async t => {
    t.timeout(2000);
    server = await createServer(PORT);
    console.log(`Mock server is running on ${BASE_URL}`);
});

test.after.always(() => {
    if (server) server.close();
});

test.serial('Logout succeeds for logged-in user', async (t) => {
    // Arrange: Mock the login of a user and their valid credentials 
    const validLoginData = { username: 'testuser', password: 'test_password' };

    const loginResponse = await loginRequest(validLoginData, PORT);
    const { body: loginBody } = loginResponse;

    t.is(loginBody.message, 'Login successful');
    t.is(loginBody.code, 200);

    // Extract token from the response
    const token = loginBody.body.token;
    t.truthy(token, 'Login response should contain a token');

    // Act: Make a logout request using valid credentials and the token
    const logoutResponse = await logoutRequest(validLoginData.username, token, PORT);
    const { body: logoutBody } = logoutResponse;

    // Assert: Validate the response
    t.is(logoutBody.code, 200, 'Logout should return a 200 status code');
    t.is(logoutBody.message, 'Logout successful', 'Logout message should be sent');
    t.is(logoutBody.body.username, validLoginData.username, 'Username in response should match username in login request');
});
