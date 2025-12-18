const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ================= SIGNUP + EMAIL VERIFICATION =================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashed,
      isVerified: false
    });

    await newUser.save();  // <— always succeeds first

    try {
      await sendEmail(email);
    } catch (mailErr) {
      console.error("Email error:", mailErr.message);
    }

    res.json({
      message: "Signup successful. Check email for verification link"
    });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= VERIFY EMAIL =================
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update user verification status
    await User.findByIdAndUpdate(decoded.id, {
      isVerified: true,
    });

    res.send(`
      <h2>Email Verified Successfully ✅</h2>
      <p>You can now close this tab and login.</p>
    `);

  } catch (error) {
    console.error(error);
    res.status(400).send(`
      <h2>Invalid or Expired Link ❌</h2>
      <p>Please request a new verification email.</p>
    `);
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not found." });
    }

    // Check if verified
   

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    res.json({
      success: true,
      message: "Login successful!",
      user: {
        userId: user.userId,     // ← FIXED
    username: user.username,
    email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
 