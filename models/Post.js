const mongoose = require("mongoose");

// Comment Schema (same as post)
const commentSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Text Post Schema
const textPostSchema = new mongoose.Schema({
  textPostId: { type: String, required: true, unique: true },

  // user identity
  userid: { type: String, required: true },
  username: { type: String, required: true },

  // text content
  text: { type: String, required: true },

  caption: { type: String, default: "" },

  textColor: { type: String, default: "#111" },

  type: { type: String, default: "text" },

  date: { type: Date, default: Date.now },

  // Likes
  likes: {
    type: [String],
    default: []
  },

  // Comments
  comments: {
    type: [commentSchema],
    default: []
  }

});

module.exports = mongoose.model("TextPost", textPostSchema);