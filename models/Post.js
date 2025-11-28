const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

//  Post Schema
const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  username: { type: String, required: true },    // use username, not userid
  url: String,
  caption: { type: String, default: "" },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },

  //  Likes Array
  likes: {
    type: [String],      // userid list
    default: []
  },

  //  Comments Array
  comments: {
    type: [commentSchema],
    default: []
  }
});

module.exports = mongoose.model("Post", postSchema);
