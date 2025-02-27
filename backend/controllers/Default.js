'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService.js');
const { successResponse, errorResponse } = require('../utils/apiUtils.js');


module.exports.seed_songs = async function (req, res, next) {
    try {
        const { genre } = req.query;

        if (!genre) {
            return errorResponse(res, 'Genre param is required', 400);
        }

        const { message, body: responseBody } = await Default.seedSongsByGenre(genre);
        return successResponse(res, message, body);
    } catch (error) {
        console.error(`Seed_songs Controller error: ${error.message}`);
        return errorResponse(res, 'Internal Server Error', 500 );
    }
}