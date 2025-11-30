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
      { username: username },
      "userId username email"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};