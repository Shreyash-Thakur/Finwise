import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/index.js';

const router = Router();

// Apply authentication and admin role requirement to all admin routes
router.use(authenticateToken, requireAdmin);

router.get('/', (req, res) => {
  res.json({ 
    message: 'Admin endpoint - TODO: implement',
    user: req.user,
    data: {
      adminId: req.user.id,
      adminRole: req.user.role,
      systemInfo: {
        version: '1.0.0',
        uptime: process.uptime(),
        nodeVersion: process.version,
      },
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalTransactions: 0,
      }
    }
  });
});

export default router;