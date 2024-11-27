'use strict';

const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const auth = require('./utils/auth');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env')});

// Server configuration
const serverPort = process.env.PORT || 5000;

// Initialize Express App
const app = express();

// Session configuration
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'dhmhtrhs legomai kai eimai veroiara',
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save new sessions even if they are empty
    cookie: {
        secure: false,
        httpOnly: true, // Prevents JavaScript access to cookies
        maxAge: 60 * 60 * 1000 // 1 hour
    }
});

// Apply global middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(sessionMiddleware); // Session middleware
app.use((req, res, next) => {
    const openRoutes = ['/api/v1/users/login', '/api/v1/users/register', '/api/v1/users/check-login'];
    // Skip token validation for open routes
    if (openRoutes.includes(req.path)) {
        return next();
    }
    // Apply token validation for all other routes
    auth.tokenRequired(req, res, next);
});


// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:4000', 'http://audiosync_frontend:3000'],
    credentials: true
};

app.use(cors(corsOptions));

// Configure oas3Tools
const oas3Options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    }
};

// Initialize the Swagger app
const oas3App = oas3Tools.expressAppConfig(
    path.join(__dirname, './api/openapi.yaml'),
    oas3Options
).getApp();

// Mount the oas3App routes into the main app
app.use(oas3App);

/**
 * Create and return an HTTP server instance af the app
 * 
 * @param {number} port - The port to listen to.
 * @returns {Promise<http.Server>}
 *  */
function createServer(port=serverPort) {
    return new Promise((resolve, reject) => {
        const server = http.createServer(app);

        server.listen(port, () => {
            console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
            console.log('Swagger-ui is available on http://localhost:%d/docs', port);
            resolve(server);
        });

        server.on('error', (err) => {
            console.error('Error starting the server:', err);
            reject(err);
        });
    });
}

if (require.main == module) {
    createServer();
}

module.exports = { createServer };
