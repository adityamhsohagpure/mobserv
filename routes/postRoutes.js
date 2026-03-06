const express = require("express");
const router = express.Router();

// Controllers
const {
  uploadPost,
  getPostsByUser,
  getAllPosts
} = require("../controllers/postController");

const { toggleLike } = require("../controllers/likeController");

const {
  addComment,
  getComments,
  deleteComment
} = require("../controllers/commentController");


// Test Route
router.get("/test", (req, res) => {
  res.send("Post Routes Working 🚀");
});


// Upload Post (image / video / text)
router.post("/upload-post", uploadPost);


// Get all posts (Feed)
router.get("/", getAllPosts);


// Get posts by specific user
router.get("/user/:userid", getPostsByUser);


// Like / Unlike Post
router.post("/:postId/like", toggleLike);


// Comments
router.post("/:postId/comments", addComment);                 // Add comment
router.get("/:postId/comments", getComments);                 // Get comments
router.delete("/:postId/comments/:commentId", deleteComment); // Delete comment


module.exports = router;