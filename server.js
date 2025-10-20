// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

// ========== Setup ==========
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // allow any origin, adjust for production if needed
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

app.use(cors());
app.use(express.json());



// ========== MongoDB Connection =========
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
// ========== Schema & Model ==========
const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// ========== API Routes ==========
app.get("/", (req, res) => {
  res.send("🚀 Chat server running on Render + MongoDB Atlas!");
});

// Fetch messages between two users
app.get("/messages", async (req, res) => {
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
});

// Send message via REST (for testing or Postman)
app.post("/messages", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({ senderId, receiverId, text });
    await newMessage.save();

    // Emit message in real-time
    io.emit("receiveMessage", {
      senderId,
      receiverId,
      text,
      createdAt: newMessage.createdAt,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Socket.IO ==========
io.on("connection", (socket) => {
  console.log("🟢 A user connected: " + socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    console.log(`👤 ${userId} joined the chat`);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, text } = data;

    const newMessage = new Message({ senderId, receiverId, text });
    await newMessage.save();

    io.emit("receiveMessage", {
      senderId,
      receiverId,
      text,
      createdAt: newMessage.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected: " + socket.id);
  });
});

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// ========== User Schema & Model ==========
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true, // ensures no duplicate emails
    required: true,
  },
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

// ========== Signup Route ==========
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create user (⚠️ plain text password as requested)
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    // Handles duplicate key errors from MongoDB (even with race conditions)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: err.message });
  }
});
