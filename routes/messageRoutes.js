const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");

// Send a message
router.post("/messages", controller.postMessage);

// Get messages between two users
router.get("/messages/:senderId/:receiverId", controller.getMessages);

// Get chat list for a user (last message per chat)
router.get("/chat-users/:userId", controller.getChatUsers);

module.exports = router;