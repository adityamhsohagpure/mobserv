const express = require("express");
const router = express.Router();

const {
  searchUsers,
  findByUsername,
  updateBio,
   getUserProfile  
} = require("../controllers/userController");

// GET /api/users/search?q=text
router.get("/search", searchUsers);

// GET /api/users/username/:username
router.get("/username/:username", findByUsername);

// PUT /api/users/update-bio/:userId
router.put("/update-bio/:userId", updateBio);
router.get("/profile/:userId", getUserProfile);
module.exports = router;