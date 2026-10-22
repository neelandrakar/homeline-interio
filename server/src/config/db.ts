import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDatabase(): Promise<boolean> {
  if (!env.MONGODB_URI) {
    if (env.NODE_ENV === 'production') {
      console.error('[DATABASE] Critical: MONGODB_URI is required in production environment.');
      return false;
    }
    console.info('[DATABASE] No MONGODB_URI configured. Operating in dev fallback in-memory store for demo leads.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.info('[DATABASE] Connected to MongoDB successfully.');
    return true;
  } catch (err: any) {
    console.error(`[DATABASE] Failed to connect to MongoDB: ${err.message}`);
    if (env.NODE_ENV === 'production') {
      throw err;
    }
    console.warn('[DATABASE] Falling back to dev in-memory store for demo reliability.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
