const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },

    // 🔹 Basic Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,   // ✅ prevent duplicate usernames
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // 🔹 Profile Section
    bio: {
      type: String,
      maxLength: 200,
      default: "",
    },

    profilePicture: {
      type: String, // Cloudinary or local URL
      default: "",
    },

    // 🔹 Friend System
    friends: [{ type: String }], 
    incomingRequests: [{ type: String }],
    sentRequests: [{ type: String }],

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);