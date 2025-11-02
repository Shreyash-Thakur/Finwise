import { Router } from 'express';
import { optionalAuth } from '../middleware/index.js';

const router = Router();

// Apply optional authentication to news routes (public data but personalized if logged in)
router.use(optionalAuth);

router.get('/', (req, res) => {
  res.json({ 
    message: 'News endpoint - TODO: implement',
    user: req.user || null,
    data: {
      latestNews: [],
      categories: ['market', 'stocks', 'mutual-funds', 'crypto', 'economy'],
      personalizedNews: req.user ? [] : null,
      userPreferences: req.user ? { categories: [], sources: [] } : null,
    }
  });
});

export default router;