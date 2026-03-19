const Message = require("../models/Message");

// ================= GET MESSAGES =================
exports.getMessages = async (req, res) => {
  try {
    const { user1, user2, page = 1, limit = 50 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ error: "user1 & user2 required" });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= SEND MESSAGE =================
exports.postMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId?.trim() || !receiverId?.trim() || !text?.trim()) {
      return res.status(400).json({
        error: "senderId, receiverId, text required",
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      status: "sent",
    });

    const io = req.app.get("io");

    // 🔥 Emit ONLY to receiver
    io.to(receiverId).emit("newMessage", message);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= MARK AS READ =================
exports.markAsRead = async (req, res) => {
  try {
    const { messageIds, userId } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: userId,
      },
      { $set: { status: "seen" } }
    );

    const io = req.app.get("io");

    // 🔥 Notify senders
    const senderIds = await Message.find({
      _id: { $in: messageIds },
    }).distinct("senderId");

    senderIds.forEach((senderId) => {
      io.to(senderId).emit("messageRead", {
        messageIds,
      });
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CHAT LIST =================
exports.getChatUsers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      { $sort: { createdAt: -1 } },

      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$text" },
          lastMessageTime: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", userId] },
                    { $ne: ["$status", "seen"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    res.json(
      chats.map((chat) => ({
        userId: chat._id,
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime,
        unreadCount: chat.unreadCount,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};