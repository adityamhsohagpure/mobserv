const express = require("express");
const router = express.Router();

const {
  uploadPost,
  getPostsByUser,
  getAllPosts,
  toggleLike,
  addComment,
  getComments
} = require("../controllers/postController");

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

// Like/Unlike
router.post("/:postId/like", toggleLike);

// Add comment
router.post("/:postId/comment", addComment);

// Get comments
router.get("/:postId/comments", getComments);

module.exports = router;

