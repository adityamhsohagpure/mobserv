
const mongoose = require("mongoose");
const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const { user1, user2, limit = 50, skip = 0 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ error: "user1 and user2 required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    })
      .sort({ createdAt: -1 }) // newest first
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    res.json(messages.reverse()); // return oldest → newest
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.postMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMessage = new Message({ senderId, receiverId, text });
    await newMessage.save();

    // send created message back
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
