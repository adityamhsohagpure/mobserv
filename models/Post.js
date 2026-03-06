const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Post Schema
const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },

  // User Info
  userid: { type: String, required: true },
  username: { type: String, required: true },

  // Media post
  url: {
    type: String,
    default: null
  },

  // Text post
  textPost: {
    type: String,
    default: null
  },

  caption: {
    type: String,
    default: ""
  },

  // post type -> image / video / text
  type: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

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

module.exports = mongoose.model("Post", postSchema);