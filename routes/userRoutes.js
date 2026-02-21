const express = require("express");
const router = express.Router();

const {
  findByUsername,
  getUserProfile,
  updateBio,
  updateProfile
} = require("../controllers/userController");

// 🔍 Find user by username
router.get("/username/:username", findByUsername);

// 👤 Get user profile by userId
router.get("/profile/:userId", getUserProfile);

// ✏️ Update only bio
router.put("/update-bio/:userId", updateBio);

// 🛠 Update full profile
router.put("/update-profile/:userId", updateProfile);

module.exports = router;