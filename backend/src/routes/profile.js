import express from 'express';
import { 
  getProfile, 
  upsertProfile, 
  computeFinancialPlan,
  getFinancialPlan,
  deleteProfile 
} from '../controllers/profileController.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * Profile Routes
 * All routes require authentication
 */

/**
 * @route   GET /api/profile
 * @desc    Get user's financial profile
 * @access  Private
 */
router.get('/', verifyJWT, getProfile);

/**
 * @route   POST /api/profile/intake
 * @desc    Create or update financial profile (10-question intake)
 * @access  Private
 * @body    {
 *   age: Number,
 *   income: Number,
 *   essentials: Number,
 *   emi: Number,
 *   incomeStability: String,
 *   emergencyMonths: String,
 *   primaryHorizon: String,
 *   selfTolerance: String,
 *   maxDrawdown: String,
 *   experience: String,
 *   liquidityNeed: String,
 *   goals: Array,
 *   taxBracket: String,
 *   dependents: Number
 * }
 */
router.post('/intake', verifyJWT, upsertProfile);

/**
 * @route   POST /api/profile/compute-plan
 * @desc    Compute financial plan based on current profile
 * @access  Private
 */
router.post('/compute-plan', verifyJWT, computeFinancialPlan);

/**
 * @route   GET /api/profile/plan
 * @desc    Get computed financial plan (cached or compute if needed)
 * @access  Private
 */
router.get('/plan', verifyJWT, getFinancialPlan);

/**
 * @route   DELETE /api/profile
 * @desc    Delete user's financial profile
 * @access  Private
 */
router.delete('/', verifyJWT, deleteProfile);

export default router;