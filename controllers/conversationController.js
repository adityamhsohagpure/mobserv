// controllers/conversationController.js
const Message = require("../models/Message");
const User = require("../models/User");

exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.params.userId;

    // 🔥 Step 1: Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId },
      ],
    }).sort({ updatedAt: -1 });

    // 🔥 Step 2: Extract unique users
    const usersMap = new Map();

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId === currentUserId
          ? msg.receiverId
          : msg.senderId;

      if (!usersMap.has(otherUserId)) {
        usersMap.set(otherUserId, msg);
      }
    });

    // 🔥 Step 3: Build conversation list
    const conversations = await Promise.all(
      Array.from(usersMap.entries()).map(async ([userId, msg]) => {
        const user = await User.findOne({ userId });

        return {
          userId,
          username: user?.username || "Unknown",
          avatar: user?.profilePicture || null,
          lastMessage: msg.text || "Media",
          lastMessageTime: msg.createdAt,
          unread: false,
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    console.error("Conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};