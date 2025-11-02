import { Router } from 'express';
import { optionalAuth } from '../middleware/index.js';
import {
  getMutualFundsList,
  getMutualFundDetails,
  getMutualFundSummary,
  searchMutualFunds,
  getLatestNAV,
  checkMFApiHealth
} from '../services/MutualFundsService.js';

const router = Router();

// Apply optional authentication to market routes (public data but personalized if logged in)
router.use(optionalAuth);

router.get('/', (req, res) => {
  res.json({ 
    message: 'Market endpoint - TODO: implement',
    user: req.user || null,
    data: {
      markets: {
        nse: { status: 'open', lastUpdate: new Date() },
        bse: { status: 'open', lastUpdate: new Date() },
        nasdaq: { status: 'closed', lastUpdate: new Date() },
      },
      indices: [],
      topGainers: [],
      topLosers: [],
      personalizedData: req.user ? { watchlist: [], alerts: [] } : null,
    }
  });
});

// Mutual Funds Routes

/**
 * GET /api/market/funds - Get featured list of 8 mutual funds with details
 */
router.get('/funds', async (req, res) => {
  try {
    const result = await getMutualFundsList();
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    res.status(200).json({
      success: true,
      authenticated: !!req.user,
      ...result.data
    });
  } catch (error) {
    console.error('Mutual funds list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured mutual funds',
      details: error.message
    });
  }
});

/**
 * GET /api/market/fund/:schemeCode - Get detailed information for a specific mutual fund
 */
router.get('/fund/:schemeCode', async (req, res) => {
  try {
    const { schemeCode } = req.params;
    
    // Validate scheme code
    if (!schemeCode || !/^\d+$/.test(schemeCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scheme code. Must be a numeric value'
      });
    }
    
    const result = await getMutualFundDetails(schemeCode);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.status(200).json({
      success: true,
      authenticated: !!req.user,
      fund: result.data
    });
  } catch (error) {
    console.error(`Fund details error for scheme ${req.params.schemeCode}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund details',
      details: error.message
    });
  }
});

/**
 * GET /api/market/funds/search - Search mutual funds by name or scheme code
 * Query params: q (required), limit (default: 20)
 */
router.get('/funds/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    const limit = parseInt(req.query.limit) || 20;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required'
      });
    }
    
    const result = await searchMutualFunds(query, limit);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(200).json({
      success: true,
      authenticated: !!req.user,
      search: result.data
    });
  } catch (error) {
    console.error('Mutual funds search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search mutual funds',
      details: error.message
    });
  }
});

/**
 * GET /api/market/fund/:schemeCode/summary - Get comprehensive fund summary with returns
 */
router.get('/fund/:schemeCode/summary', async (req, res) => {
  try {
    const { schemeCode } = req.params;
    
    if (!schemeCode || !/^\d+$/.test(schemeCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scheme code. Must be a numeric value'
      });
    }
    
    const result = await getMutualFundSummary(schemeCode);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.status(200).json({
      success: true,
      authenticated: !!req.user,
      ...result.data
    });
  } catch (error) {
    console.error(`Fund summary error for scheme ${req.params.schemeCode}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund summary',
      details: error.message
    });
  }
});

/**
 * GET /api/market/fund/:schemeCode/nav - Get latest NAV for a specific fund
 */
router.get('/fund/:schemeCode/nav', async (req, res) => {
  try {
    const { schemeCode } = req.params;
    
    if (!schemeCode || !/^\d+$/.test(schemeCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scheme code. Must be a numeric value'
      });
    }
    
    const result = await getLatestNAV(schemeCode);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    res.status(200).json({
      success: true,
      authenticated: !!req.user,
      nav: result.data
    });
  } catch (error) {
    console.error(`Latest NAV error for scheme ${req.params.schemeCode}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest NAV',
      details: error.message
    });
  }
});

/**
 * GET /api/market/health - Health check for mutual funds API
 */
router.get('/health', async (req, res) => {
  try {
    const result = await checkMFApiHealth();
    
    res.status(result.success ? 200 : 503).json({
      success: result.success,
      service: 'mutual-funds-api',
      ...result
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      service: 'mutual-funds-api',
      status: 'error',
      error: error.message
    });
  }
});

export default router;