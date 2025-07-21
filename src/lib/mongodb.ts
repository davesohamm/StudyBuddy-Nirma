import mongoose from 'mongoose';
import { config } from './config';

declare global {
  var mongoose: any;
}

const MONGODB_URI = config.mongodb.uri;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      dbName: config.mongodb.dbName
    };

    console.log('🔄 Connecting to MongoDB...', {
      dbName: config.mongodb.dbName,
      environment: config.app.environment
    });

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

// Get database connection status
export function getConnectionStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
}

// Close database connection
export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    console.log('🔒 MongoDB disconnected');
  }
}

export default connectDB; 