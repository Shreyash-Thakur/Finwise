import { Router } from 'express';
import { authenticateToken } from '../middleware/index.js';

const router = Router();

// Apply authentication to all portfolio routes
router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio endpoint - TODO: implement',
    user: req.user,
    data: {
      userId: req.user.id,
      portfolios: [],
      totalValue: 0,
      holdings: [],
    }
  });
});

export default router;