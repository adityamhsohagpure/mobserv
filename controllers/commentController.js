const Post = require("../models/Post");

// ⭐ Add a Comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userid, text } = req.body;

    if (!userid || !text) {
      return res.status(400).json({ error: "userid & text are required" });
    }

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = { userid, text, date: new Date() };

    post.comments.push(newComment);
    await post.save();

    return res.status(200).json({
      message: "Comment added",
      comments: post.comments
    });

  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ⭐ Get Comments of a Post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({
      postId,
      comments: post.comments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ Delete a Comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();

    res.status(200).json({
      message: "Comment deleted",
      comments: post.comments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
