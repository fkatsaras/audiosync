'use strict';

const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store); 
const cors = require('cors');
const db = require('./utils/dbUtils');

const auth = require('./middleware/auth');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env')});

// Server configuration
const serverPort = process.env.PORT || 5000;

// Initialize Express App
const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://localhost:4000',
        new RegExp(/^https:\/\/audiosync-[a-z0-9]+-fkatsaras-projects\.vercel\.app&/),  // For matching the hashed URL from vercel
        'https://audiosync-git-master-fkatsaras-projects.vercel.app',
        'https://audiosync-liard.vercel.app',
    ],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use((req, res, next) => {
    const openRoutes = ['/api/v1/users/login', '/api/v1/users/register'];
    // Skip token validation for open routes
    if (openRoutes.includes(req.path)) {
        return next();
    }
    // Apply token validation for all other routes
    auth.tokenRequired(req, res, next);
});

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

        server.listen(port, '0.0.0.0' ,() => {
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
    createServer(5000);
}

module.exports = { createServer };
