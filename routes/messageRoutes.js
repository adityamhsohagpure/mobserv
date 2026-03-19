const express = require("express");
const router = express.Router();
const {
  getMessages,
  postMessage,
  markAsRead,
  getChatUsers,
} = require("../controllers/messageController");

// GET messages
router.get("/", getMessages);

// SEND message
router.post("/", postMessage);

// MARK AS READ
router.put("/read", markAsRead);

// CHAT LIST
router.get("/chats/:userId", getChatUsers);

module.exports = router;