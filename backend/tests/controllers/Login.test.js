const test = require('ava');
const { createServer } = require('../../index');
const { loginRequest } = require('../../utils/testUtils'); 

process.env.NODE_ENV = 'test';


let server;
const PORT = 4000;

test.before(async t => {
    t.timeout(2000);    // Set timeout to 2 sec
    server = await createServer(PORT);    // Start the mock server
    console.log(`Mock Server is running on http://localhost:${PORT}`);
});

test.after.always(() => {
    if (server) server.close(); // Close server after tests
});

test.serial('Login succeeds with valid credentials', async (t) => {
    // Arrange: Mock valid credentials
    const validCredentials = { username: 'testuser', password: 'test_password' };

    // Act: Make the login request using valid credentials
    const { body } = await loginRequest(validCredentials, PORT);
    const response = body;

    // Assert: Verify the response
    t.is(response.code, 200);
    t.truthy(response.body.token, 'Token should exist in the response');
    t.is(response.message, 'Login successful');
});

test.serial('Login fails with invalid credentials', async (t) => {
    // Arrange: Mock invalid credentials
    const invalidCredentials = {
        username: 'testuser',
        password: 'invalid'
    };

    // Act: Make the login request
    const { body } = await loginRequest(invalidCredentials, PORT);
    const response = body;

    // Assert: Verify the response
    t.is(response.code, 401);
    t.is(response.message, 'Invalid username or password');
});

// Test case where the user does not exist in the database
test.serial('Login fails with non-existent user', async (t) => {
    // Arrange: Mock credentials for a user that does not exist
    const nonExistentUser = { username: 'nonexistentuser', password: 'somepassword' };

    // Act: Make the login request using the non-existent user's credentials
    const { body } = await loginRequest(nonExistentUser, PORT);
    const response = body;

    // Assert: Verify the response for a non-existent user
    t.is(response.code, 404); 
    t.is(response.message, 'User not found'); 
});
