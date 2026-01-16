require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const { connect } = require('./config/db');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require("./routes/friendRoutes");

// Sockets
const initChat = require('./sockets/chatSocket');

// ========== Setup ==========
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());

// ========== Routes ==========
app.use('/api/auth', authRoutes);        // ✅ works now
app.use('/api/messages', messageRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use("/api/friends", friendRoutes);


// Admin
app.use("/admin", require("./routes/admin"));

// ========== DB Connect ==========
connect(process.env.MONGO_URI).catch((err) => {
  logger.error('DB connect failed, exiting');
  process.exit(1);
});

// ========== Sockets ==========
initChat(io);

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
