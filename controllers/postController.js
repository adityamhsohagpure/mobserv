const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

exports.uploadPost = async (req, res) => {
  try {
    const { username, url, caption } = req.body;

    const newPost = new Post({
      postId: uuidv4(), // unique ID
      username,
      url,
      caption,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post uploaded successfully!",
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
