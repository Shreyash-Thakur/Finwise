import { Router } from 'express';
import { authenticateToken } from '../middleware/index.js';

const router = Router();

// Apply authentication to all goals routes
router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json({ 
    message: 'Goals endpoint - TODO: implement',
    user: req.user,
    data: {
      userId: req.user.id,
      goals: [],
      totalGoals: 0,
      completedGoals: 0,
    }
  });
});

export default router;