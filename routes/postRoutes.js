const express = require("express");
const router = express.Router();

// ⭐ IMPORT POST CONTROLLER FUNCTIONS
const {
  uploadPost,
  getPostsByUser,
  getAllPosts
} = require("../controllers/postController");

// ⭐ IMPORT LIKE CONTROLLER
const { toggleLike } = require("../controllers/likeController");

// ⭐ IMPORT COMMENT CONTROLLER
const {
  addComment,
  getComments,
  deleteComment
} = require("../controllers/commentController");


// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Post Routes Working 🚀");
});

// ⭐ Upload Post
router.post("/upload-post", uploadPost);

// ⭐ Get posts of a specific user
router.get("/user/:username", getPostsByUser);

// ⭐ Get ALL posts
router.get("/", getAllPosts);

// ⭐ LIKE / UNLIKE a Post
router.post("/:postId/like", toggleLike);

// ⭐ COMMENTS
router.post("/:postId/comments", addComment);                 // Add comment
router.get("/:postId/comments", getComments);                 // Get all comments
router.delete("/:postId/comments/:commentId", deleteComment); // Delete comment

module.exports = router;
