const mongoose = require("mongoose");

const TextPostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  textColor: {
    type: String,
    default: "#111",
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TextPost", TextPostSchema);