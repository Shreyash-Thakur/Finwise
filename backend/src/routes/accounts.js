import { Router } from 'express';
import { authenticateToken } from '../middleware/index.js';

const router = Router();

// Apply authentication to all accounts routes
router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json({ 
    message: 'Accounts endpoint - TODO: implement',
    user: req.user,
    data: {
      userId: req.user.id,
      linkedAccounts: [],
      totalAccounts: 0,
      lastSynced: null,
    }
  });
});

export default router;