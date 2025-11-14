const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    let messages;
    if (user1 && user2) {
      messages = await Message.find({
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      }).sort({ createdAt: 1 });
    } else {
      messages = await Message.find().sort({ createdAt: 1 }).limit(50);
    }
    res.json(messages);
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
