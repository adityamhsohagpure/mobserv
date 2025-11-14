# Server

This folder contains the server implementation for the chat app.

Structure:

- config/db.js       # DB connection helper
- models/Message.js  # Mongoose model
- controllers/       # Express controllers
- routes/            # Express routes
- sockets/           # Socket.IO initialization
- utils/logger.js    # Simple logger wrapper

Start the server from this folder (project root has entrypoint `server.js`):

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies from project root: `npm install`.
3. Start: `node server/server.js`
