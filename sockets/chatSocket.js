const Message = require('../models/Message');

module.exports = function initChat(io) {
  io.on('connection', (socket) => {
    console.log('🟢 A user connected: ' + socket.id);

    socket.on('join', (userId) => {
      socket.userId = userId;
      console.log(`👤 ${userId} joined the chat`);
    });

    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, text } = data;
      const newMessage = new Message({ senderId, receiverId, text });
      await newMessage.save();

      io.emit('receiveMessage', {
        senderId,
        receiverId,
        text,
        createdAt: newMessage.createdAt,
      });
    });

    socket.on('disconnect', () => {
      console.log('🔴 A user disconnected: ' + socket.id);
    });
  });
};
