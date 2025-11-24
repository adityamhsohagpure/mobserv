exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userid } = req.body;

    if (!userid)
      return res.status(400).json({ error: "Userid required" });

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(userid);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(user => user !== userid);
    } else {
      // Like
      post.likes.push(userid);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: post.likes.length,
      likedBy: post.likes
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
