const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set. Please configure it in .env');
    process.exit(1);
  }
  await mongoose.connect(uri, {
    // options can be added here if needed
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;

