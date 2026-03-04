const TextPost = require("../models/TextPost");


// Create Text Post
exports.createTextPost = async (req, res) => {
  try {
    const { text, caption, textColor, userId } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const newPost = new TextPost({
      text,
      caption,
      textColor,
      userId,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Text post created successfully",
      post: savedPost,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// Get All Text Posts
exports.getAllTextPosts = async (req, res) => {
  try {
    const posts = await TextPost.find().sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// Get Single Post
exports.getTextPostById = async (req, res) => {
  try {
    const post = await TextPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// Delete Post
exports.deleteTextPost = async (req, res) => {
  try {
    const post = await TextPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};