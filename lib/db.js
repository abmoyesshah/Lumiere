import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not set. Skipping database connection.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { // useNewUrlParser: true,// useUnifiedTopology: true,
});
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB connection error:', error.message);
    // Don't throw - allow app to continue without DB
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}
