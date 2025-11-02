import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  
  // App
  app: {
    origin: process.env.APP_ORIGIN || 'http://localhost:3000',
  },

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    name: 'finwise.sid',
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  },
  
  // Encryption
  encryption: {
    key: process.env.FINWISE_KMS_KEY || 'default-key-change-in-production-32b',
  },
  
  // External APIs
  apis: {
    finnhub: {
      token: process.env.FINNHUB_TOKEN || '',
    },
    covalent: {
      apiKey: process.env.COVALENT_API_KEY || '',
    },
    newsApi: {
      key: process.env.NEWSAPI_KEY || '',
    },
    zerodha: {
      apiKey: process.env.ZERODHA_API_KEY || '',
      apiSecret: process.env.ZERODHA_API_SECRET || '',
      redirectUri: process.env.ZERODHA_REDIRECT_URI || 'http://localhost:5000/api/accounts/zerodha/callback',
    },
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};