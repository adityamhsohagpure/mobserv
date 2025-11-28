const express = require("express");
const router = express.Router();

const {
  uploadPost,
  getPostsByUser,
  getAllPosts,
 
  
} = require("../controllers/postController");
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

// ⭐ LIKE / UNLIKE A POST
router.post("/:postId/like", toggleLike);


module.exports = router;
