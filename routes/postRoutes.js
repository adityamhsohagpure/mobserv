const express = require("express");
const router = express.Router();

// IMPORT NAME MUST MATCH EXACT EXPORT NAME
const { uploadPost } = require("../controllers/postController");

// Test route (to confirm route is loading on Render)
router.get("/test", (req, res) => {
  res.send("Post Routes Working 🚀");
});

// Upload post API
router.post("/upload-post", uploadPost);
module.exports = router;