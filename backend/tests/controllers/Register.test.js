const test = require('ava');
const got = require('got');
const http = require('http');
const index = require('../../index');
const db = require('../../utils/dbUtils');

let server;
const PORT = 4001;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to perform register request
const registerRequest = async (userData) => {
    return await got.post(`${BASE_URL}/api/v1/users/register`, {
        json: userData,
        responseType: 'json',
        throwHttpErrors: false
    });
};

test.before(async (t) => {
    t.timeout(2000); 
    server = await index.createServer(PORT);
    console.log(`Mock server is running on http://localhost:${PORT}`);
});

test.after.always(() => {
    if (server) server.close();
});

test.serial('Registration succeeds with valid data', async (t) => {
    // Arrange: Mock valid user data
    const validData = {
        username: 'newuser',
        password: 'password123',
        email: 'newuser@email.com',
        first_name: 'New',
        last_name: 'User'
    };

    // Act: Make the registration request
    const { body } = await registerRequest(validData);
    const response = body;

    // Assert: Verify the response
    t.is(response.code, 201);
    t.is(response.message, 'User registered successfully');
    t.deepEqual(response.body, {
        username: 'newuser',
        email: 'newuser@email.com',
    });

    // Cleanup: Remove 
    const connection = db.createConnection();
    const query = "DELETE FROM users WHERE username = ?";
    const result = await db.executeQuery(connection, query, [validData.username]);

    t.is(result.affectedRows, 1, 'Test user should be deleted successfully');
});

test.serial('Registration fails with existing username', async (t) => {
    // Arrange: Mock existing username scenario
  const existingUserData = {
    username: 'existinguser',
    password: 'password123',
    email: 'existinguser@example.com',
    first_name: 'Existing',
    last_name: 'User'
  };

  // Act: Make the registration request with an existing username
  const { body } = await registerRequest(existingUserData);
  const response = body;

  // Assert: Verify the response for existing user
  t.is(response.code, 400);
  t.is(response.message, 'Username or email already exists');
});
