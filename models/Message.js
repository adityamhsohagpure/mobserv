const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
{
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  text: {
    type: String,
    default: ""
  },

  messageType: {
    type: String,
    enum: ["text", "image"],
    default: "text"
  },

  isRead: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true,
  collection: "messages"
}
);

module.exports = mongoose.model("Message", MessageSchema);