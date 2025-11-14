// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connect } = require('./config/db');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');
const initChat = require('./sockets/chatSocket');
const logger = require('./utils/logger');
const postRoutes = require('./routes/postRoutes');

// ========== Setup ==========
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // allow any origin, adjust for production if needed
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

app.use(cors());
app.use(express.json());

// mount routes
app.use('/', messageRoutes);



// Routes for creating and fetching user posts (post upload APIs)
app.use('/api/posts', postRoutes);

// connect to DB then start server
connect(process.env.MONGO_URI).catch((err) => {
  logger.error('DB connect failed, exiting');
  process.exit(1);
});

// initialize sockets
initChat(io);

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
