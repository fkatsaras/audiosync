'use strict';

var utils = require('../utils/writer.js');
var Home = require('../service/HomeService');
const api = require('../utils/apiUtils.js');

module.exports.home = function home (req, res, next) {
  const current_user = req.query.current_user;  // Extracted by middleware

  if(!current_user) {
    api.errorResponse(
      res,
      message="current user query parameter required.",
      code=400,
      body=null
    );
    return;
  }

  Home.home(current_user)
    .then(function(response) {
      api.successResponse(res=res, body=response);
    })
    .catch(function(error) {
      api.errorResponse(res=res, message=`Internal server error: ${error}`, code=500);
    });
};