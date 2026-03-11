const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  username: {type :String , required:true }
});

// Post Schema
const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },

  userid: { type: String, required: true },
  username: { type: String, required: true },


  
  url: {
    type: String,
    default: null
  },

  textPost: {
    type: String,
    default: null
  },

  textColor: {
    type: String,
    default: "#111"
  },

  caption: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  likes: {
    type: [String],
    default: []
  },

  comments: {
    type: [commentSchema],
    default: []
  }
});

// ⭐ Export model
module.exports = mongoose.model("Post", postSchema);