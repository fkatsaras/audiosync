// index.js
'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Server configuration
const serverPort = process.env.PORT || 8080;
const app = express();

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to `true` if using HTTPS
}));

// Set up CORS
const allowedOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Swagger router configuration
const options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

// Initialize Swagger middleware with OpenAPI spec
const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const openapiApp = expressAppConfig.getApp();

// Use OpenAPI app within the Express app
app.use(openapiApp);

// Start server
http.createServer(app).listen(serverPort, () => {
    console.log(`Your server is listening on port ${serverPort} (http://localhost:${serverPort})`);
    console.log(`Swagger UI is available on http://localhost:${serverPort}/docs`);
});

module.exports = app;
