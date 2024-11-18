'use strict';

const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const tokenRequired = require('./utils/tokenRequired');

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
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true, // Prevents JavaScript access to cookies
        maxAge: 60 * 60 * 1000 // 1 hour
    }
});

// Apply global middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(sessionMiddleware); // Session middleware
app.use((req, res, next) => {
    const openRoutes = ['/api/v1/users/login', '/api/v1/users/register'];
    // Skip token validation for open routes
    if (openRoutes.includes(req.path)) {
        return next();
    }
    // Apply token validation for routes requiring BearerAuth
    if (req.openapi && req.openapi.security && req.openapi.security.includes('BearerAuth')) {
        return tokenRequired(req, res, next);
    }
    next();
});


// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true // Allow sending cookies 
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

// Start the server
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});


