exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { username, text } = req.body;

    if (!username || !text)
      return res.status(400).json({ error: "Username & comment text required" });

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = { username, text };
    post.comments.push(newComment);
    await post.save();

    res.status(200).json({
      message: "Comment added",
      comments: post.comments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({
      count: post.comments.length,
      comments: post.comments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
