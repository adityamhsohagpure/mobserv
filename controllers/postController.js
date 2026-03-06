const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

exports.uploadPost = async (req, res) => {
  try {
    const { userid, username, url, caption, type, textPost, textColor } = req.body;

    if (!userid || !username || !type) {
      return res.status(400).json({
        message: "userid, username and type are required",
      });
    }

    // Validation based on post type
    if ((type === "image" || type === "video") && !url) {
      return res.status(400).json({
        message: "URL is required for image/video posts",
      });
    }

    if (type === "text" && !textPost) {
      return res.status(400).json({
        message: "textPost content is required for text posts",
      });
    }

    const newPost = new Post({
      postId: uuidv4(),
      userid,
      username,
      url: url || null,
      textPost: textPost || null,
      textColor: textColor || "#111",
      caption,
      type
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


// GET POSTS BY USER
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