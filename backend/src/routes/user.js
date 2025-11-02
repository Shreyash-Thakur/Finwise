import { Router } from 'express';
import { authenticateToken } from '../middleware/index.js';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateToken);

router.get('/profile', (req, res) => {
  res.json({ 
    message: 'User profile endpoint',
    user: req.user,
    data: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      kycStatus: req.user.kycStatus,
    }
  });
});

router.put('/profile', (req, res) => {
  res.json({ 
    message: 'Update user profile endpoint - TODO: implement',
    user: req.user 
  });
});

export default router;