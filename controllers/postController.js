const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

exports.uploadPost = async (req, res) => {
  try {
    // ⭐ FIX: Add "type" here
    const { username, url, caption, type } = req.body;

    if (!username || !url || !type) {
      return res
        .status(400)
        .json({ message: "Username, URL and type are required" });
    }

    const newPost = new Post({
      postId: uuidv4(),
      username,
      url,
      caption,
      type,   // ⭐ FIX: Type added here
    });

    await newPost.save();

    res.status(201).json({
      message: "Post uploaded successfully!",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
