/**
 * Fund Mathematics Utilities
 * Calculations for CAGR, rolling returns, drawdown, SIP backtesting, and expense impact
 */

export interface NAVPoint {
  date: string;
  nav: number;
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * @param navSeries Array of NAV points
 * @param years Number of years to calculate (from end backwards)
 * @returns CAGR as percentage
 */
export function cagr(navSeries: NAVPoint[], years: number): number {
  if (!navSeries || navSeries.length < 2) return 0;
  const monthsNeeded = years * 12;
  if (navSeries.length < monthsNeeded) {
    // Not enough history, use what we have
    const actualYears = navSeries.length / 12;
    if (actualYears < 0.5) return 0; // Too short

    const startNav = navSeries[0].nav;
    const endNav = navSeries[navSeries.length - 1].nav;
    return (Math.pow(endNav / startNav, 1 / actualYears) - 1) * 100;
  }
  const startIndex = navSeries.length - monthsNeeded;
  const startNav = navSeries[startIndex].nav;
  const endNav = navSeries[navSeries.length - 1].nav;
  return (Math.pow(endNav / startNav, 1 / years) - 1) * 100;
}

/**
 * Calculate rolling returns
 * @param navSeries Array of NAV points
 * @param windowMonths Rolling window size in months
 * @returns Array of rolling return percentages
 */
export function rollingReturns(navSeries: NAVPoint[], windowMonths: number): number[] {
  if (!navSeries || navSeries.length < windowMonths + 1) return [];
  const returns: number[] = [];
  for (let i = windowMonths; i < navSeries.length; i++) {
    const startNav = navSeries[i - windowMonths].nav;
    const endNav = navSeries[i].nav;
    const years = windowMonths / 12;
    const rollingReturn = (Math.pow(endNav / startNav, 1 / years) - 1) * 100;
    returns.push(rollingReturn);
  }
  return returns;
}

/**
 * Calculate maximum drawdown
 * @param navSeries Array of NAV points
 * @returns Object with maxDrawdown percentage and worst month index
 */
export function maxDrawdown(navSeries: NAVPoint[]): {
  drawdown: number;
  worstMonth: number;
} {
  if (!navSeries || navSeries.length < 2) {
    return {
      drawdown: 0,
      worstMonth: 0
    };
  }
  let maxDrawdown = 0;
  let worstMonth = 0;
  let peak = navSeries[0].nav;
  let peakIndex = 0;
  for (let i = 1; i < navSeries.length; i++) {
    const currentNav = navSeries[i].nav;
    if (currentNav > peak) {
      peak = currentNav;
      peakIndex = i;
    } else {
      const drawdown = (peak - currentNav) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        worstMonth = i;
      }
    }
  }
  return {
    drawdown: maxDrawdown,
    worstMonth
  };
}

/**
 * Calculate monthly returns from NAV series
 */
function calculateMonthlyReturns(navSeries: NAVPoint[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < navSeries.length; i++) {
    const ret = (navSeries[i].nav - navSeries[i - 1].nav) / navSeries[i - 1].nav * 100;
    returns.push(ret);
  }
  return returns;
}

/**
 * Calculate standard deviation (volatility)
 */
export function volatility(navSeries: NAVPoint[]): number {
  const returns = calculateMonthlyReturns(navSeries);
  if (returns.length < 2) return 0;
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / returns.length;

  // Annualized volatility
  return Math.sqrt(variance) * Math.sqrt(12);
}

/**
 * SIP Backtest - Calculate returns for systematic investment
 * @param navSeries Array of NAV points
 * @param sipAmount Monthly SIP amount
 * @param day Day of month for SIP (default 1)
 * @returns Object with invested amount, current value, and XIRR approximation
 */
export function sipBacktest(navSeries: NAVPoint[], sipAmount: number, day: number = 1): {
  invested: number;
  currentValue: number;
  xirr: number;
  units: number;
} {
  if (!navSeries || navSeries.length < 2) {
    return {
      invested: 0,
      currentValue: 0,
      xirr: 0,
      units: 0
    };
  }
  let totalUnits = 0;
  let totalInvested = 0;

  // Invest SIP amount each month
  for (let i = 0; i < navSeries.length; i++) {
    const units = sipAmount / navSeries[i].nav;
    totalUnits += units;
    totalInvested += sipAmount;
  }
  const currentNav = navSeries[navSeries.length - 1].nav;
  const currentValue = totalUnits * currentNav;

  // Simple XIRR approximation using CAGR formula
  const years = navSeries.length / 12;
  const xirr = years > 0 ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 : 0;
  return {
    invested: totalInvested,
    currentValue: Math.round(currentValue),
    xirr: xirr,
    units: totalUnits
  };
}

/**
 * Calculate expense ratio impact
 * @param expenseRatio Annual expense ratio as percentage
 * @param navSeries Array of NAV points
 * @returns Impact as percentage difference vs 0% expense
 */
export function expenseImpact(expenseRatio: number, navSeries: NAVPoint[]): number {
  if (!navSeries || navSeries.length < 2) return 0;
  const years = navSeries.length / 12;
  const startNav = navSeries[0].nav;
  const endNav = navSeries[navSeries.length - 1].nav;
  const actualReturn = (endNav / startNav - 1) * 100;

  // Approximate return without expense (add back expense impact)
  const returnWithoutExpense = actualReturn + expenseRatio * years;
  return returnWithoutExpense - actualReturn;
}

/**
 * Normalize NAV series to base 100
 */
export function normalizeToBase100(navSeries: NAVPoint[]): {
  date: string;
  value: number;
}[] {
  if (!navSeries || navSeries.length === 0) return [];
  const baseNav = navSeries[0].nav;
  return navSeries.map(point => ({
    date: point.date,
    value: point.nav / baseNav * 100
  }));
}

/**
 * Check if fund has enough history for period
 */
export function hasEnoughHistory(navSeries: NAVPoint[], years: number): boolean {
  if (!navSeries) return false;
  return navSeries.length >= years * 12;
}