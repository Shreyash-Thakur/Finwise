import mongoose from 'mongoose';
import { config } from './env.js';
console.log(config.MONGODB_URI);
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📤 MongoDB connection closed through app termination');
  process.exit(0);
});