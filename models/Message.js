const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'message' });

module.exports = mongoose.model('Message', MessageSchema);
