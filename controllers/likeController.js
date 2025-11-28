exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userid);

    if (alreadyLiked) {
      // 🔽 Unlike (remove userid)
      post.likes = post.likes.filter((user) => user !== userid);
    } else {
      // 🔼 Like (push userid)
      post.likes.push(userid);
    }

    await post.save();

    return res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: post.likes.length,
      likedBy: post.likes,
      postId: postId
    });

  } catch (error) {
    console.error("Toggle like error:", error);
    return res.status(500).json({ error: error.message });
  }
};
