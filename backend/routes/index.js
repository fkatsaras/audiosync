const express = require('express');
const router = express.Router();

const UserController = require('../controllers/Users');

router.post("/login", UserController.login_user);

module.exports = router;
