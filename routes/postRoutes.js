const express = require("express");
const router = express.Router();

// IMPORT NAME MUST MATCH EXACT EXPORT NAME
const { uploadPost , getPostsByUser ,  getAllPosts, } = require("../controllers/postController");

// Test route (to confirm route is loading on Render)
router.get("/test", (req, res) => {
  res.send("Post Routes Working 🚀");
});

// Upload post API
router.post("/upload-post", uploadPost);
// get by id
router.get("/user/:username", getPostsByUser);
// GET all posts
router.get("/", getAllPosts);

module.exports = router;