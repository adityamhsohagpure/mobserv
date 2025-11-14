const mongoose = require('mongoose');

async function connect(uri) {
  const mongoURI = uri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatApp';
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`✅ Connected to MongoDB (${mongoURI})`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = { connect };
