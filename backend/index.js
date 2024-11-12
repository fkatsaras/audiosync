'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const session = require('express-session');
const routes = require('./routes/index');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Server configuration
const serverPort = process.env.PORT || 5000;
const app = express();

// // Configure session
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'default_secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Set to `true` if using HTTPS
// }));


// Swagger router configuration
const options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};



// Register routes
app.use('/api/v1', routes); // Use '/api/v1' as base path for all routes

// Middleware setup
app.use(cors()); // Enable Cross-Origin Request
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Start server
http.createServer(app).listen(serverPort, () => {
    console.log(`AudioSync backend server is running on port ${serverPort} (http://localhost:${serverPort})`);
    console.log(`Swagger UI is available on http://localhost:${serverPort}/docs`);
});

module.exports = app;

