import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import accountRoutes from './accounts.js';
import portfolioRoutes from './portfolio.js';
import marketRoutes from './market.js';
import goalRoutes from './goals.js';
import newsRoutes from './news.js';
import adminRoutes from './admin.js';
import profileRoutes from './profile.js';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/me', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/market', marketRoutes);
router.use('/goals', goalRoutes);
router.use('/news', newsRoutes);
router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'FinWise API',
    version: '1.0.0',
    description: 'Production-ready personal finance API',
    endpoints: {
      auth: '/api/auth',
      user: '/api/me',
      accounts: '/api/accounts',
      portfolio: '/api/portfolio',
      market: '/api/market',
      goals: '/api/goals',
      news: '/api/news',
      admin: '/api/admin',
      profile: '/api/profile',
    },
  });
});

export default router;