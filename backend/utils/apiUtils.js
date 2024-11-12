const ApiResponse = require('../models/apiResponse');

function successResponse(res, message, body = null, code = 200) {
  const response = new ApiResponse({
    code,
    type: 'success',
    message,
    body,
  });
  return res.status(code).json(response.toObject());
}

function errorResponse(res, message, code = 404) {
  const response = new ApiResponse({
    code,
    type: 'error',
    message,
    body: null,
  });
  return res.status(code).json(response.toObject());
}

module.exports = { successResponse, errorResponse };
