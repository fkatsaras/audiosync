const ApiResponse = require('../models/apiResponse');

/**
 * Sends a standardized success response to the client.
 *
 * @function successResponse
 * @param {Object} res - The response object.
 * @param {string} message - The success message to send in the response.
 * @param {Object|null} [body=null] - Optional data to include in the response body.
 * @param {number} [code=200] - HTTP status code for the response.
 * 
 * @returns {Object} - JSON object containing the response.
 */
function successResponse(res, message, body = null, code = 200) {
  const response = new ApiResponse({
    code,
    type: 'success',
    message,
    body,
  });
  return res.status(code).json(response.toObject());
}

/**
 * Sends a standardized error response to the client.
 *
 * @function errorResponse
 * @param {Object} res - The response object.
 * @param {string} message - The error message to send in the response.
 * @param {number} [code=404] - HTTP status code for the error response.
 * 
 * @returns {Object} - JSON object containing the error response.
 */
function errorResponse(res, message, code = 404) {
  const response = new ApiResponse({
    code,
    type: 'error',
    message,
    body: null,
  });
  return res.status(code).json(response.toObject());
}

module.exports = { 
  successResponse,
  errorResponse
};
