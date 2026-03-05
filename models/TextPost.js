const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Text Post Schema
const textPostSchema = new mongoose.Schema({
  textPostId: { type: String, required: true, unique: true },

  userid: { type: String, required: true },
  username: { type: String, required: true },

  text: { type: String, required: true },

  caption: { type: String, default: "" },

  textColor: { type: String, default: "#111" },

  type: { type: String, default: "text" },

  date: { type: Date, default: Date.now },

  likes: {
    type: [String],
    default: []
  },

  comments: {
    type: [commentSchema],
    default: []
  }
});

module.exports =
  mongoose.models.TextPost ||
  mongoose.model("TextPost", textPostSchema);