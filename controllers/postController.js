const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

exports.uploadPost = async (req, res) => {
  try {
    // ⭐ FIX: Add "type" here
    const { userid, url, caption, type } = req.body;

    if (!userid || !url || !type) {
      return res
        .status(400)
        .json({ message: "Userid, URL and type are required" });
    }

    const newPost = new Post({
      postId: uuidv4(),
      userid,
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
exports.getPostsByUser = async (req, res) => {
  try {
    const { userid } = req.params;

    const posts = await Post.find({ userid }).sort({ date: -1 });

    res.status(200).json({
      message: `Posts by ${userid}`,
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.status(200).json({
      message: "All posts",
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("GET ALL POSTS ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
