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

  // ✔ Using userid as your actual identity field
  userid: { type: String, required: true },

  url: String,
  caption: { type: String, default: "" },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Likes will store the user IDs who liked the post
  likes: {
    type: [String],
    default: []
  },

  // Comments array
  comments: {
    type: [commentSchema],
    default: []
  }
});

module.exports = mongoose.model("Post", postSchema);
