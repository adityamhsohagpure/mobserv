const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  userid: String,
  url: String,
  caption: String,
  type: String,
  date: { type: Date, default: Date.now },

  // 🆕 Likes
  likes: {
    type: [String],  // store userid who liked the post
    default: []
  },

  // 🆕 Comments
  comments: {
    type: [commentSchema],
    default: []
  }
});

module.exports = mongoose.model("Post", postSchema);

module.exports = mongoose.model("Post", postSchema);
