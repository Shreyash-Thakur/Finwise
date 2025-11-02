/**
 * Financial Planning Service - Risk Scoring and Asset Allocation Engine
 * Implements the comprehensive 10-question risk assessment and allocation logic
 */

/**
 * Utility function to clamp a value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map income stability to score
 */
function mapStability(stability) {
  const mapping = {
    'Very Stable': 100,
    'Stable': 80,
    'Variable': 50,
    'Highly Variable': 30
  };
  return mapping[stability] || 50;
}

/**
 * Map savings rate to score
 */
function mapSavingsRate(savingsRate) {
  if (savingsRate >= 0.40) return 100;
  if (savingsRate >= 0.25) return 85;
  if (savingsRate >= 0.10) return 60;
  if (savingsRate >= 0.00) return 40;
  return 20; // negative savings rate
}

/**
 * Map DTI (Debt-to-Income) ratio to score
 */
function mapDTI(dti) {
  if (dti <= 0.10) return 100;
  if (dti <= 0.20) return 80;
  if (dti <= 0.35) return 55;
  if (dti <= 0.50) return 35;
  return 20;
}

/**
 * Map emergency fund months to score
 */
function mapEmergency(emergencyMonths) {
  const mapping = {
    '0': 20,
    '1-2': 40,
    '3-5': 70,
    '6-9': 85,
    '10+': 100
  };
  return mapping[emergencyMonths] || 20;
}

/**
 * Map investment horizon to score
 */
function mapHorizon(horizon) {
  const mapping = {
    '<1y': 10,
    '1-3y': 35,
    '3-5y': 60,
    '5-10y': 80,
    '>10y': 95
  };
  return mapping[horizon] || 60;
}

/**
 * Map risk tolerance to score
 */
function mapTolerance(tolerance) {
  const mapping = {
    'Very Low': 20,
    'Low': 40,
    'Moderate': 60,
    'High': 80,
    'Very High': 95
  };
  return mapping[tolerance] || 60;
}

/**
 * Map drawdown comfort to score
 */
function mapDrawdown(drawdown) {
  const mapping = {
    '0-5%': 20,
    '5-10%': 35,
    '10-20%': 60,
    '20-35%': 80,
    '35%+': 95
  };
  return mapping[drawdown] || 60;
}

/**
 * Map investment experience to score
 */
function mapExperience(experience) {
  const mapping = {
    'None': 30,
    'Beginner': 45,
    'Intermediate': 65,
    'Advanced': 85
  };
  return mapping[experience] || 45;
}

/**
 * Compute the required return rate to meet goals
 */
function computeRequiredReturn(goals, monthlyInvestable) {
  if (!goals || goals.length === 0 || monthlyInvestable <= 0) {
    return 7; // default conservative return expectation
  }

  // Find the nearest goal
  const now = new Date();
  const nearestGoal = goals.reduce((nearest, goal) => {
    const goalDate = new Date(goal.targetDate);
    const nearestDate = new Date(nearest.targetDate);
    return goalDate < nearestDate ? goal : nearest;
  });

  const targetDate = new Date(nearestGoal.targetDate);
  const yearsToGoal = Math.max(0.5, (targetDate - now) / (365.25 * 24 * 60 * 60 * 1000));
  const monthsToGoal = yearsToGoal * 12;
  const targetAmount = nearestGoal.targetAmount;

  // Simple SIP formula: FV = PMT * [((1+r)^n - 1) / r] * (1+r)
  // Solve for r using iterative approach
  let rate = 0.08; // start with 8% annual
  const tolerance = 0.001;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const monthlyRate = rate / 12;
    const n = monthsToGoal;
    const fv = monthlyInvestable * (Math.pow(1 + monthlyRate, n) - 1) / monthlyRate * (1 + monthlyRate);
    
    if (Math.abs(fv - targetAmount) < tolerance * targetAmount) {
      break;
    }
    
    // Adjust rate based on difference
    if (fv < targetAmount) {
      rate += 0.001;
    } else {
      rate -= 0.001;
    }
    
    // Keep rate within reasonable bounds
    rate = clamp(rate, 0.04, 0.18);
  }

  return rate;
}

/**
 * Compute need adjustment based on required returns
 */
function computeNeedAdjustment(goals, income, essentials, emi) {
  const monthlyInvestable = Math.max(0, income - essentials - emi);
  const requiredReturn = computeRequiredReturn(goals, monthlyInvestable);
  
  if (requiredReturn >= 0.15) return 8;
  if (requiredReturn >= 0.12) return 4;
  if (requiredReturn >= 0.10) return 2;
  if (requiredReturn >= 0.07) return 0;
  if (requiredReturn >= 0.05) return -3;
  return -6;
}

/**
 * Main function to compute risk score (0-100) based on the formula:
 * Risk Score (0-100): Capacity × Tolerance ± Need
 */
export function computeRiskScore(profile) {
  // 1. Capacity Score (0-100) - Can you afford to take risk?
  const ageScore = clamp(100 - (profile.age - 25) * 2, 10, 100);
  const stabilityScore = mapStability(profile.incomeStability);
  
  const savingsRate = (profile.income - profile.essentials - profile.emi) / profile.income;
  const savingsScore = mapSavingsRate(savingsRate);
  
  const dti = profile.emi / profile.income;
  const dtiScore = mapDTI(dti);
  
  const emergencyScore = mapEmergency(profile.emergencyMonths);
  const horizonScore = mapHorizon(profile.primaryHorizon);

  const capacity = Math.round(
    0.20 * ageScore + 
    0.20 * stabilityScore + 
    0.20 * savingsScore +
    0.15 * dtiScore + 
    0.15 * emergencyScore + 
    0.10 * horizonScore
  );

  // 2. Tolerance Score (0-100) - How much risk will you stomach?
  const selfTol = mapTolerance(profile.selfTolerance);
  const drawdown = mapDrawdown(profile.maxDrawdown);
  const experience = mapExperience(profile.experience);
  
  const tolerance = Math.round(
    0.5 * selfTol + 
    0.3 * drawdown + 
    0.2 * experience
  );

  // 3. Need Adjustment (-10 to +10) - Do you need higher return to hit goals?
  const needAdj = computeNeedAdjustment(
    profile.goals, 
    profile.income, 
    profile.essentials, 
    profile.emi
  );

  // 4. Composite Score: 0.6×Capacity + 0.4×Tolerance + NeedAdj
  let rawScore = 0.6 * capacity + 0.4 * tolerance + needAdj;

  // 5. Apply Guardrails
  const emergencyMonthsNum = getEmergencyMonthsNumber(profile.emergencyMonths);
  
  // If EmergencyMonths < 3 → cap Raw at 55
  if (emergencyMonthsNum < 3) {
    rawScore = Math.min(rawScore, 55);
  }
  
  // If DTI > 40% → cap Raw at 50
  if (dti > 0.40) {
    rawScore = Math.min(rawScore, 50);
  }
  
  // If Horizon < 1y → cap Raw at 45
  if (profile.primaryHorizon === '<1y') {
    rawScore = Math.min(rawScore, 45);
  }

  // Final risk score clamped between 0-100
  const riskScore = clamp(Math.round(rawScore), 0, 100);

  // Return detailed breakdown for transparency
  return {
    riskScore,
    components: {
      capacity,
      tolerance,
      needAdjustment: needAdj,
      rawScore: Math.round(rawScore * 100) / 100,
      guardrails: {
        emergencyFundCap: emergencyMonthsNum < 3 ? 55 : null,
        dtiCap: dti > 0.40 ? 50 : null,
        horizonCap: profile.primaryHorizon === '<1y' ? 45 : null
      }
    }
  };
}

/**
 * Convert emergency months string to number for calculations
 */
function getEmergencyMonthsNumber(emergencyMonths) {
  const mapping = {
    '0': 0,
    '1-2': 1.5,
    '3-5': 4,
    '6-9': 7.5,
    '10+': 12
  };
  return mapping[emergencyMonths] || 0;
}

/**
 * Map risk score to risk band
 */
function getRiskBand(riskScore) {
  if (riskScore <= 35) return 'Conservative';
  if (riskScore <= 55) return 'Moderately Conservative';
  if (riskScore <= 70) return 'Moderate';
  if (riskScore <= 85) return 'Moderately Aggressive';
  return 'Aggressive';
}

/**
 * Get base allocation ranges for each risk band
 */
function getAllocationRanges(band) {
  const ranges = {
    'Conservative': {
      equity: { min: 15, max: 35 },
      debt: { min: 45, max: 65 },
      gold: { min: 5, max: 10 },
      reit: { min: 2, max: 5 },
      crypto: { min: 0, max: 2 },
      cash: { min: 0, max: 10 }
    },
    'Moderately Conservative': {
      equity: { min: 30, max: 50 },
      debt: { min: 35, max: 55 },
      gold: { min: 5, max: 10 },
      reit: { min: 2, max: 5 },
      crypto: { min: 0, max: 3 },
      cash: { min: 0, max: 10 }
    },
    'Moderate': {
      equity: { min: 50, max: 65 },
      debt: { min: 25, max: 40 },
      gold: { min: 5, max: 10 },
      reit: { min: 2, max: 5 },
      crypto: { min: 0, max: 5 },
      cash: { min: 0, max: 5 }
    },
    'Moderately Aggressive': {
      equity: { min: 65, max: 80 },
      debt: { min: 15, max: 30 },
      gold: { min: 5, max: 10 },
      reit: { min: 2, max: 5 },
      crypto: { min: 0, max: 8 },
      cash: { min: 0, max: 5 }
    },
    'Aggressive': {
      equity: { min: 80, max: 90 },
      debt: { min: 5, max: 15 },
      gold: { min: 5, max: 10 },
      reit: { min: 2, max: 5 },
      crypto: { min: 0, max: 10 },
      cash: { min: 0, max: 3 }
    }
  };
  
  return ranges[band] || ranges['Moderate'];
}

/**
 * Interpolate within a range based on risk score position in band
 */
function interpolate(min, max, fraction) {
  return Math.round(min + (max - min) * fraction);
}

/**
 * Get position of risk score within its band (0-1)
 */
function getBandFraction(riskScore, band) {
  const bandRanges = {
    'Conservative': { min: 0, max: 35 },
    'Moderately Conservative': { min: 36, max: 55 },
    'Moderate': { min: 56, max: 70 },
    'Moderately Aggressive': { min: 71, max: 85 },
    'Aggressive': { min: 86, max: 100 }
  };
  
  const range = bandRanges[band];
  if (!range) return 0.5;
  
  return (riskScore - range.min) / (range.max - range.min);
}

/**
 * Normalize allocation to ensure it sums to 100%
 */
function normalizeAllocation(allocation) {
  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  if (total === 0) return allocation;
  
  const normalized = {};
  for (const [key, value] of Object.entries(allocation)) {
    normalized[key] = Math.round((value / total) * 100);
  }
  
  // Handle rounding errors
  const newTotal = Object.values(normalized).reduce((sum, val) => sum + val, 0);
  if (newTotal !== 100) {
    const diff = 100 - newTotal;
    normalized.equity += diff; // Add difference to equity
  }
  
  return normalized;
}

/**
 * Compute asset allocation based on risk score and profile
 */
export function computeAllocation(riskScoreResult, profile) {
  const riskScore = typeof riskScoreResult === 'number' ? riskScoreResult : riskScoreResult.riskScore;
  const band = getRiskBand(riskScore);
  const ranges = getAllocationRanges(band);
  const bandFraction = getBandFraction(riskScore, band);
  
  // Base allocation
  let allocation = {
    equity: interpolate(ranges.equity.min, ranges.equity.max, bandFraction),
    debt: interpolate(ranges.debt.min, ranges.debt.max, bandFraction),
    gold: interpolate(ranges.gold.min, ranges.gold.max, bandFraction),
    reit: interpolate(ranges.reit.min, ranges.reit.max, bandFraction),
    crypto: interpolate(ranges.crypto.min, ranges.crypto.max, bandFraction),
    cash: 0
  };
  
  const notes = [];
  
  // Goal-aware tilts
  if (profile.primaryHorizon === '<1y') {
    const shift = 15;
    allocation.equity -= shift;
    allocation.debt += Math.floor(shift * 0.7);
    allocation.gold += Math.floor(shift * 0.3);
    notes.push('Reduced equity allocation for short-term goals (<1 year)');
  } else if (profile.primaryHorizon === '1-3y') {
    const shift = 10;
    allocation.equity -= shift;
    allocation.debt += Math.floor(shift * 0.7);
    allocation.gold += Math.floor(shift * 0.3);
    notes.push('Slightly reduced equity allocation for medium-term goals (1-3 years)');
  }
  
  // Emergency fund check
  const emergencyMonthsNum = getEmergencyMonthsNumber(profile.emergencyMonths);
  if (emergencyMonthsNum < 3) {
    allocation.cash = 10;
    allocation.equity -= 6;
    allocation.debt -= 4;
    allocation.crypto = 0;
    notes.push('Increased cash allocation until emergency fund target is met');
  }
  
  // Liquidity needs
  if (profile.liquidityNeed === 'Within 3 months') {
    allocation.cash += 5;
    allocation.equity -= 3;
    allocation.debt -= 2;
    notes.push('Increased cash allocation for high liquidity needs');
  }
  
  // Crypto caps and rules
  if (band.includes('Conservative')) {
    allocation.crypto = Math.min(allocation.crypto, 2);
  } else if (band === 'Moderate') {
    allocation.crypto = Math.min(allocation.crypto, 5);
  }
  
  if (emergencyMonthsNum < 3) {
    allocation.crypto = 0;
  }
  
  allocation.crypto = Math.min(allocation.crypto, 10); // Global cap
  
  // Savings rate adjustments
  const savingsRate = (profile.income - profile.essentials - profile.emi) / profile.income;
  if (savingsRate < 0.10) {
    allocation.equity -= 5;
    allocation.debt += 5;
    notes.push('Reduced equity allocation due to low savings rate');
  }
  
  // Normalize to ensure 100% total
  allocation = normalizeAllocation(allocation);
  
  return {
    riskScore,
    band,
    allocationPct: allocation,
    notes
  };
}

/**
 * Compute monthly rupee amounts based on allocation percentages
 */
export function computeMonthlyAmounts(profile, allocationPct) {
  const monthlyInvestable = Math.max(0, profile.income - profile.essentials - profile.emi);
  
  // Check if emergency fund top-up is needed
  const emergencyMonthsNum = getEmergencyMonthsNumber(profile.emergencyMonths);
  const emergencyRequired = profile.essentials * 6; // Target 6 months
  const emergencyCurrent = profile.essentials * emergencyMonthsNum;
  const emergencyGap = Math.max(0, emergencyRequired - emergencyCurrent);
  const emergencyTopUp = Math.min(monthlyInvestable * 0.3, emergencyGap / 6); // Spread over 6 months, max 30% of surplus
  
  const availableForInvestment = monthlyInvestable - emergencyTopUp;
  
  const monthlyAmounts = {};
  for (const [asset, pct] of Object.entries(allocationPct)) {
    monthlyAmounts[asset] = Math.round((availableForInvestment * pct) / 100);
  }
  
  const notes = [];
  if (emergencyTopUp > 0) {
    notes.push(`Emergency fund top-up: ₹${Math.round(emergencyTopUp).toLocaleString()}/month`);
  }
  
  return { monthlyAmounts, notes };
}

/**
 * Main function to compute complete financial plan
 */
export function computePlan(profile) {
  const riskScoreResult = computeRiskScore(profile);
  const allocationResult = computeAllocation(riskScoreResult, profile);
  const { monthlyAmounts, notes: amountNotes } = computeMonthlyAmounts(profile, allocationResult.allocationPct);
  
  const allNotes = [...allocationResult.notes, ...amountNotes];
  
  return {
    riskScore: riskScoreResult.riskScore,
    riskScoreBreakdown: riskScoreResult.components,
    band: allocationResult.band,
    allocationPct: allocationResult.allocationPct,
    monthlyAmounts,
    notes: allNotes,
    computedAt: new Date()
  };
}