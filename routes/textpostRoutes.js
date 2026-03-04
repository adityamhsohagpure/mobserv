const express = require("express");
const router = express.Router();
const TextPost = require("../models/TextPost");


// Create text post
router.post("/create", async (req, res) => {
  try {
    const { text, caption, textColor, userId } = req.body;

    const newPost = new TextPost({
      text,
      caption,
      textColor,
      userId,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all posts
router.get("/all", async (req, res) => {
  try {
    const posts = await TextPost.find().sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;