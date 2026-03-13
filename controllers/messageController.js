const Message = require("../models/Message");

/*
GET /messages?user1=ID1&user2=ID2&page=1&limit=50
*/
exports.getMessages = async (req, res) => {

  try {

    const { user1, user2, page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    // If both users provided → fetch conversation
    if (user1 && user2) {

      const messages = await Message.find({
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

      return res.json(messages);
    }

    // If users not provided → return latest messages
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(messages);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }
};



/*
POST /messages
Body:
{
 senderId,
 receiverId,
 text
}
*/
exports.postMessage = async (req, res) => {

  try {

    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({
        error: "senderId, receiverId and text are required"
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text
    });

    await newMessage.save();

    res.status(201).json(newMessage);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

};