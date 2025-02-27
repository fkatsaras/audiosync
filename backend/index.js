'use strict';

const http = require('http');
const path = require('path');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const auth = require('./middleware/auth');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env')});

// Server configuration
const serverPort = process.env.PORT || 5000;

// Initialize Express App
const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:4000',
    'https://audiosync-git-master-fkatsaras-projects.vercel.app',
    'https://audiosync-liard.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || /^https:\/\/audiosync-[a-z0-9]+-fkatsaras-projects\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Middleware for parsing request bodies (URL encoded and JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Auth Middleware
app.use((req, res, next) => {
    const openRoutes = ['/api/v1/users/login', '/api/v1/users/register', '/api/v1/admin/seed-songs'];
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

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});


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

// if (require.main == module) {
//     createServer(5000);
// }

module.exports = { createServer };
module.exports = app;
