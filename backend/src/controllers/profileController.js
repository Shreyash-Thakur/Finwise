import { Profile } from '../models/Profile.js';
import { computePlan } from '../services/planner.js';

/**
 * Profile Controller - Handle financial profile CRUD operations
 */

/**
 * Get user's financial profile
 */
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

/**
 * Create or update financial profile (intake form)
 */
export const upsertProfile = async (req, res) => {
  try {
    const {
      age,
      income,
      essentials,
      emi,
      incomeStability,
      emergencyMonths,
      primaryHorizon,
      selfTolerance,
      maxDrawdown,
      experience,
      liquidityNeed,
      goals,
      taxBracket,
      dependents
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'age', 'income', 'essentials', 'incomeStability', 'emergencyMonths',
      'primaryHorizon', 'selfTolerance', 'maxDrawdown', 'experience', 'liquidityNeed'
    ];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }

    // Validate numeric fields
    if (age < 18 || age > 100) {
      return res.status(400).json({
        success: false,
        error: 'Age must be between 18 and 100'
      });
    }

    if (income <= 0 || essentials < 0 || emi < 0) {
      return res.status(400).json({
        success: false,
        error: 'Income must be positive, expenses and EMI must be non-negative'
      });
    }

    if (essentials + emi > income) {
      return res.status(400).json({
        success: false,
        error: 'Essential expenses plus EMI cannot exceed income'
      });
    }

    // Validate enum values
    const validEnums = {
      incomeStability: ['Very Stable', 'Stable', 'Variable', 'Highly Variable'],
      emergencyMonths: ['0', '1-2', '3-5', '6-9', '10+'],
      primaryHorizon: ['<1y', '1-3y', '3-5y', '5-10y', '>10y'],
      selfTolerance: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
      maxDrawdown: ['0-5%', '5-10%', '10-20%', '20-35%', '35%+'],
      experience: ['None', 'Beginner', 'Intermediate', 'Advanced'],
      liquidityNeed: ['Within 3 months', '3-12 months', '1-3 years', '>3 years (unlikely)']
    };

    for (const [field, validValues] of Object.entries(validEnums)) {
      if (!validValues.includes(req.body[field])) {
        return res.status(400).json({
          success: false,
          error: `Invalid value for ${field}. Must be one of: ${validValues.join(', ')}`
        });
      }
    }

    // Validate goals if provided
    if (goals && Array.isArray(goals)) {
      for (const goal of goals) {
        if (!goal.title || !goal.targetAmount || !goal.targetDate) {
          return res.status(400).json({
            success: false,
            error: 'Each goal must have title, targetAmount, and targetDate'
          });
        }
        
        if (goal.targetAmount <= 0) {
          return res.status(400).json({
            success: false,
            error: 'Goal target amount must be positive'
          });
        }
        
        const goalDate = new Date(goal.targetDate);
        if (goalDate <= new Date()) {
          return res.status(400).json({
            success: false,
            error: 'Goal target date must be in the future'
          });
        }
      }
    }

    // Upsert profile
    const profileData = {
      userId: req.user.id,
      age,
      income,
      essentials,
      emi: emi || 0,
      incomeStability,
      emergencyMonths,
      primaryHorizon,
      selfTolerance,
      maxDrawdown,
      experience,
      liquidityNeed,
      goals: goals || [],
      taxBracket: taxBracket || '20%',
      dependents: dependents || 0,
      // Clear cached results when profile is updated
      riskScoreCache: null,
      allocationCache: null,
      lastComputedAt: null
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      profileData,
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: profile,
      message: 'Profile saved successfully'
    });
  } catch (error) {
    console.error('Upsert profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to save profile'
    });
  }
};

/**
 * Compute financial plan based on current profile
 */
export const computeFinancialPlan = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found. Please complete your financial profile first.'
      });
    }

    // Compute the plan using the planning service
    const plan = computePlan(profile.toObject());
    
    // Update profile with computed results
    profile.riskScoreCache = plan.riskScore;
    profile.allocationCache = {
      riskScore: plan.riskScore,
      band: plan.band,
      allocationPct: plan.allocationPct,
      monthlyAmounts: plan.monthlyAmounts,
      notes: plan.notes
    };
    profile.lastComputedAt = plan.computedAt;
    
    await profile.save();

    res.json({
      success: true,
      data: plan,
      message: 'Financial plan computed successfully'
    });
  } catch (error) {
    console.error('Compute plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compute financial plan'
    });
  }
};

/**
 * Get computed financial plan (cached or compute if needed)
 */
export const getFinancialPlan = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found. Please complete your financial profile first.'
      });
    }

    // If no cached plan or profile updated since last computation, recompute
    if (!profile.allocationCache || !profile.lastComputedAt || 
        profile.updatedAt > profile.lastComputedAt) {
      
      const plan = computePlan(profile.toObject());
      
      // Update cache
      profile.riskScoreCache = plan.riskScore;
      profile.allocationCache = {
        riskScore: plan.riskScore,
        band: plan.band,
        allocationPct: plan.allocationPct,
        monthlyAmounts: plan.monthlyAmounts,
        notes: plan.notes
      };
      profile.lastComputedAt = plan.computedAt;
      
      await profile.save();
      
      return res.json({
        success: true,
        data: plan
      });
    }

    // Return cached plan
    const cachedPlan = {
      riskScore: profile.allocationCache.riskScore,
      band: profile.allocationCache.band,
      allocationPct: profile.allocationCache.allocationPct,
      monthlyAmounts: profile.allocationCache.monthlyAmounts,
      notes: profile.allocationCache.notes,
      computedAt: profile.lastComputedAt
    };

    res.json({
      success: true,
      data: cachedPlan
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get financial plan'
    });
  }
};

/**
 * Delete user's financial profile
 */
export const deleteProfile = async (req, res) => {
  try {
    const result = await Profile.findOneAndDelete({ userId: req.user.id });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete profile'
    });
  }
};