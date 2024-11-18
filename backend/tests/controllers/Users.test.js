const test = require('ava');
const got = require('got');
const http = require('http');
const app = require('../../index');
const env = 

let server;
const PORT = process.env.TEST_PORT;
const BASE_URL = `http://localhost:${PORT}`;

test.before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve))    // Start the server
});

test.after.always(() => {
    server.close(); // Close server after tests
});

test.serial('Login succeeds with valid credentials', async (t) => {
    // Arrange: Mock Users.login_user
    const validCredentials = {
        username: 'test_user',
        password: 'test_password'
    };

    // Act: Make the login request using got
    const response = await got.post(`${BASE_URL}/api/v1/users/login`, {
        json: validCredentials,
        responseType: 'json',
        throwHttpErrors: false  // Avoid throwing on 4xx/5xx
    });

    // Assert: Verify the response
    t.is(response.statusCode, 200);
    t.truthy(response.body.data.token, 'Token should exist in the response');
    t.is(response.body.message, 'Login successful');
});

test.serial('Login fails with invalid credentials', async (t) => {
    // Act: Make the login request with invalid credentials
    const invalidCredentials = {
        username: 'invalid_user',
        password:
    }
})