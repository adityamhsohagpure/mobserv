const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, bio } = req.body;

    // 🔹 Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // 🔹 Validate bio length (optional)
    if (bio && bio.length > 200) {
      return res.status(400).json({ error: "Bio cannot exceed 200 characters" });
    }

    // 🔹 Check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 🔹 Check existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 🔹 Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashed,
      bio: bio || "", // ✅ optional
      isVerified: false,
    });

    // 🔹 Create JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET
    );

    // 🔵 Send email (don’t fail signup if email fails)
    try {
      await sendEmail(email, token);
    } catch (mailErr) {
      console.error("Email failed:", mailErr.message);
    }

    // ✅ Success Response
    res.status(201).json({
      message: "Signup successful. Please check your email to verify.",
      user: {
        id: newUser._id,
        userId: newUser.userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
        isVerified: newUser.isVerified,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
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

    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: {  userId: user.userId,username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

module.exports = router;