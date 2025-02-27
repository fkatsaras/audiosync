'use-strict'

const http = require('http');
const app = require('./index');

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

module.exports = { createServer };