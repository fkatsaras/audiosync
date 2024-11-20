'use strict';

const Search = require('../service/SearchService');
const db = require('../utils/dbUtils');
const api = require('../utils/apiUtils');
const { response } = require('express');

module.exports.search_artists_get = function search_artists_get(req, res, next) {
  const userId = req.current_user;
  const userQuery = req.query.q; // Get parameters from URL
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');

  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0; 

  Search.search_artists_get(userId, userQuery, limit, offset)
    .then((response) => {
      api.successResponse(res, response.message, response.body);
    })
    .catch((error) => {
      api.errorResponse(res, error.message, error.code || 500);
    });
};

module.exports.search_songs_get = function search_songs_get(req, res, next) {
  const userId = req.query["user-id"]; // Get userId
  const userQuery = req.query.q; // Get parameters from URL
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0; 

  Search.search_songs_get(userId, userQuery, limit, offset)
    .then((response) => {
      api.successResponse(res, response.message, response.body);
    })
    .catch((error) => {
      api.errorResponse(res, error.message, error.code || 500);
    });
};

