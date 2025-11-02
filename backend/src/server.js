import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import { startCronJobs } from './jobs/cron.js';
import { corsMiddleware, rateLimiter, errorHandler } from './middleware/index.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: config.session.secret,
  name: config.session.name,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongodb.uri,
    collectionName: 'sessions',
    ttl: config.session.maxAge / 1000, // TTL in seconds
  }),
  cookie: {
    secure: config.nodeEnv === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: config.session.maxAge, // 2 days
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

export async function createApp() {
  // Connect to database
  await connectDB();
  
  // Start cron jobs
  startCronJobs();
  
  return app;
}

export default app;