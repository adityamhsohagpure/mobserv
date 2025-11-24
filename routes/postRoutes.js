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


module.exports = router;

