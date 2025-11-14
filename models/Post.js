const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Post", postSchema);
