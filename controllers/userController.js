// controllers/userController.js
const User = require("../models/User");

// GET /api/users/search?q=text
exports.searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) return res.json({ results: [] });

    // case-insensitive partial search on username or email
    const regex = new RegExp(q, "i");

    const users = await User.find(
      {
        $or: [
          { username: regex },
          { email: regex }
        ]
      },  
      "userId username email" // only return these fields
    ).limit(20);

    res.json({ results: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};


// GET /api/users/username/:username
exports.findByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne(
      { username },
      "userId username email bio profilePicture friends"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        ...user.toObject(),
        friendsCount: user.friends?.length || 0
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
// PUT /api/users/update-bio/:userId
exports.updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    if (!bio || bio.trim() === "") {
      return res.status(400).json({ error: "Bio cannot be empty" });
    }

    if (bio.length > 200) {
      return res.status(400).json({ error: "Bio max length is 200 characters" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { bio: bio.trim() },
      { new: true }
    ).select("userId username bio profilePicture");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Bio updated successfully",
      user: updatedUser
    });

  } catch (err) {
  console.log("FULL ERROR:", err);
  res.status(500).json({ error: err.message });
}
};
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne(
      { userId: req.params.userId }
    ).select("userId username email bio profilePicture friends");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        ...user.toObject(),
        friendsCount: user.friends?.length || 0
      }
    });

  } catch (err) {
    console.log("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};