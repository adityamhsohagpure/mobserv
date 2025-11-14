const express = require("express");
const router = express.Router();
const { createPost } = require("../controllers/postController");

router.post("/upload", createPost);

module.exports = router;