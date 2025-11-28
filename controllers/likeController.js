const Post = require("../models/Post");

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Try both: custom postId AND MongoDB _id
    let post = await Post.findOne({ postId });
    if (!post) {
      post = await Post.findById(postId); // fallback
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userid);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== userid);
    } else {
      post.likes.push(userid);
    }

    await post.save();

    return res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: post.likes.length,
      likedBy: post.likes,
      postId: post.postId || post._id
    });

  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ error: error.message });
  }
};
