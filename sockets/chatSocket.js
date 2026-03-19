
import { Platform } from "react-native";

class SocketService {
  socket = null;

  connect(userId) {
    if (this.socket) return;

    const URL =
      Platform.OS === "android"
        ? "http://10.0.2.2:5000"   // Android emulator
        : "http://localhost:5000"; // iOS / web

    this.socket = io(URL, {
      transports: ["websocket"], // 🔥 IMPORTANT
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.socket.emit("join", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }

  // 🔥 SEND MESSAGE
  sendMessage(data) {
    this.socket.emit("sendMessage", data);
  }

  // 🔥 RECEIVE MESSAGE
  onMessage(callback) {
    this.socket.on("newMessage", callback);
  }

  // 🔥 READ RECEIPT
  onMessageRead(callback) {
    this.socket.on("messageRead", callback);
  }

  // 🔥 TYPING
  typing(to) {
    this.socket.emit("typing", { to });
  }

  onTyping(callback) {
    this.socket.on("typing", callback);
  }

  stopTyping(to) {
    this.socket.emit("stopTyping", { to });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();