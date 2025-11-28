const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment
} = require("../controllers/commentController");
const { toggleLike } = require("../controllers/likeController");
// Test route
router.get("/test", (req, res) => {
  res.send("Post Routes Working 🚀");
});

// Upload post
router.post("/upload-post", uploadPost);

// Get posts of a user
router.get("/user/:username", getPostsByUser);

// Get all posts
router.get("/", getAllPosts);

//  LIKE / UNLIKE A POST
router.post("/:postId/like", toggleLike);

//  Comments
router.post("/:postId/comments", addComment);       // Add comment
router.get("/:postId/comments", getComments);       // Get comments
router.delete("/:postId/comments/:commentId", deleteComment); // Delete

module.exports = router;
