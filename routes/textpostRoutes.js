const express = require("express");
const router = express.Router();
const TextPost = require("../models/TextPost");


// Create text post
router.post("/create", async (req, res) => {
  try {

    const { text, caption, textColor, userid, username } = req.body;

    const newPost = new TextPost({
      textPostId: "text_" + Date.now(),
      userid,
      username,
      text,
      caption,
      textColor,
      type: "text"
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


// Get all text posts
router.get("/all", async (req, res) => {
  try {

    const posts = await TextPost.find()
      .sort({ date: -1 });

    res.json({
      posts
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

module.exports = router;