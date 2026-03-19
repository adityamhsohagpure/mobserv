module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔹 Join user room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    // 🔹 Typing
    socket.on("typing", ({ to }) => {
      io.to(to).emit("typing");
    });

    socket.on("stopTyping", ({ to }) => {
      io.to(to).emit("stopTyping");
    });

    // 🔹 Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};