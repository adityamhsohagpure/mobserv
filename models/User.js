const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const userSchema = new mongoose.Schema({
   userId: { type: String, default: uuidv4 },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  //  Friend System
  friends: [{ type: String }], // store userId
  incomingRequests: [{ type: String }], // userId of request senders
  sentRequests: [{ type: String }], // userId of people this user sent requests to
});

module.exports = mongoose.model("User", userSchema);
