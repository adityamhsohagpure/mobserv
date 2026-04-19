require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { connect } = require("./config/db");
const logger = require("./utils/logger");

// Routes
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const friendRoutes = require("./routes/friendRoutes");

const conversationRoutes = require("./routes/conversationRoutes");
// Sockets
const initChat = require("./sockets/chatSocket");

// ========== INIT ==========
const app = express();
const server = http.createServer(app);

// ========== SOCKET.IO ==========
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔥 Make io available in controllers
app.set("io", io);

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// ========== ROUTES ==========
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); // 🔥 FIXED
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api", conversationRoutes);
// Admin
app.use("/admin", require("./routes/admin"));

// ========== HEALTH CHECK ==========
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ========== DB CONNECT ==========
connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB Connected ✅"))
  .catch((err) => {
    logger.error("DB connect failed ❌", err);
    process.exit(1);
  });

// ========== SOCKET INIT ==========
initChat(io);

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: "Server Error" });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});