const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4 },

  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  // 🔹 Profile Section
  bio: {
    type: String,
    maxLength: 200,
    default: ""
  },

  profilePicture: {
    type: String,   // store image URL (Cloudinary / local path)
    default: ""
  },

  // 🔹 Friend System
  friends: [{ type: String }], 
  incomingRequests: [{ type: String }],
  sentRequests: [{ type: String }]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);