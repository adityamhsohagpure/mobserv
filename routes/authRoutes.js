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

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verified: false,
    });

    // Create email verification token
    const token = jwt.sign(
      { userId: user._id },
      process.env.EMAIL_SECRET,
      { expiresIn: "1d" }
    );

    const verifyLink = `${process.env.SERVER_URL}/api/auth/verify/${token}`;

    // Send verification email
    await sendEmail(
      email,
      "Verify your Email",
      `
        <h2>Verify Your Email</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyLink}">${verifyLink}</a>
      `
    );

    res.json({
      success: true,
      message: "Signup successful! Check your email to verify your account.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= VERIFY EMAIL =================
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    await User.findByIdAndUpdate(decoded.userId, { verified: true });

    res.send("Your email has been verified successfully 🎉");
  } catch (err) {
    res.status(400).send("Invalid or expired verification link.");
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
    if (!user.verified) {
      return res.status(401).json({ error: "Please verify your email first." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
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
 