const express = require('express');
const router = express.Router();
const controller = require('../controllers/messageController');

// GET /messages
router.get('/messages', controller.getMessages);

// POST /messages
router.post('/messages', controller.postMessage);

module.exports = router;
