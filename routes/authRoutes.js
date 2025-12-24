const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

   // Inside router.post("/signup")
try {
  await sendEmail(email, token);
} catch (mailErr) {
  console.error("FULL ERROR:", mailErr);
  return res.status(500).json({ 
    error: "Mail system failed", 
    details: mailErr.message // This will tell you EXACTLY why Resend rejected it
  });
}

    res.json({ message: "Signup successful! Please check your email to verify your account." });
  } catch (err) {
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});

// VERIFY EMAIL
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    if (!user) return res.status(404).send("User not found");

    res.send("<h2>Email Verified Successfully! ✅</h2><p>You can now log in.</p>");
  } catch (error) {
    res.status(400).send("<h2>Invalid or Expired Link ❌</h2>");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    
    // 🔥 Verification Check
    if (!user.isVerified) {
      return res.status(401).json({ error: "Please verify your email first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

module.exports = router;