import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

// Use global caching to prevent multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If no promise exists, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}






// import mongoose from 'mongoose';

// let isConnected = false;

// export async function connectDB() {
//   if (isConnected) {
//     return;
//   }

//   if (!process.env.MONGODB_URI) {
//     console.warn('MONGODB_URI not set. Skipping database connection.');
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, { // useNewUrlParser: true,// useUnifiedTopology: true,
// });
//     isConnected = true;
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.warn('MongoDB connection error:', error.message);
//     // Don't throw - allow app to continue without DB
//   }
// }

// export async function disconnectDB() {
//   if (!isConnected) {
//     return;
//   }

//   try {
//     await mongoose.disconnect();
//     isConnected = false;
//     console.log('MongoDB disconnected');
//   } catch (error) {
//     console.error('MongoDB disconnection error:', error);
//     throw error;
//   }
// }
