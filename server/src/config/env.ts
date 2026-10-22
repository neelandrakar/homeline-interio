import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or server
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'homeline-interio-demo-jwt-secret-key-change-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Configuration
  AI_PROVIDER: process.env.AI_PROVIDER || 'fallback', // 'gemini' | 'openai' | 'fallback'
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || (process.env.AI_PROVIDER === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'),
  
  // Admin Provisioning Credentials
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@homelineinterio.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Homeline@2026Admin',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Principal Interior Designer',
  
  // Safety
  ALLOW_DEMO_STORAGE: process.env.ALLOW_DEMO_STORAGE !== 'false',
};
