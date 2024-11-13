'use strict';

const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Server configuration
const serverPort = process.env.PORT || 5000;



// // Configure session
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'default_secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Set to `true` if using HTTPS
// }));


// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, './api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (in POST requests)


// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});


