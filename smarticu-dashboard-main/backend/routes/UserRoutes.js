const express = require("express");
const { createUser } = require('../controllers/CreateUser.js')

const router = express.Router();

router.post("/api/users/create", createUser); // Route for creating a user

module.exports = router;
