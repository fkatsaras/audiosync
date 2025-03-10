'use strict';

const path = require('path');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const express = require('express');

const auth = require('./middleware/auth');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env')});

// Initialize Express App
const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:4000',
    'https://audiosync-git-master-fkatsaras-projects.vercel.app',
    'https://audiosync-liard.vercel.app',
    'https://audiosync-backend.vercel.app',
    'https://audiosync-backend.vercel.com',
];


// Vercel-friendly CORS middleware
const handleCors = (req, res, next) => {
    const origin = req.headers.origin;
    
    // Allow CORS for any origin that is allowed
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With, Accept');
    
    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
};

// Apply the CORS middleware globally
app.use(handleCors);

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

// diagnostic endpoint for CORS testing
app.get('/api/cors-test', (req, res) => {
    res.json({
        message: 'CORS test successful',
        origin: req.headers.origin || 'No origin header',
        method: req.method,
        path: req.path,
        headers: req.headers
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = app;   // Direct export for vercel