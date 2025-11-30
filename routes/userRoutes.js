const express = require('express');
const router = express.Router();

const { findByUsername } = require("../controllers/userController");

router.get("/username/:username", findByUsername);

module.exports = router;
