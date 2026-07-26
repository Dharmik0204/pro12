const mongoose = require('mongoose');
const createDefaultAdmin = require('./createDefaultAdmin');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wandervista';
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);

    // Auto-create default admin account if not already present
    await createDefaultAdmin();

    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.error('Tip: If using MongoDB Atlas, make sure your IP is whitelisted (0.0.0.0/0) and password is correct.');
  }
};

module.exports = connectDB;
