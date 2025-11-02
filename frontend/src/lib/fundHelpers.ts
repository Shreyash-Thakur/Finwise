/**
 * Fund calculation helpers for projections and comparisons
 */

/**
 * Normalize a series to base 100
 */
export function normalizeBase100(series: number[]): number[] {
  if (!series || series.length === 0) return [];
  const base = series[0];
  if (base === 0) return series.map(() => 100);
  return series.map(val => val / base * 100);
}

/**
 * Calculate projected SIP value
 * FV = SIP * [((1+r/12)^(12*y)-1)/(r/12)] * (1+r/12)
 */
export function projectedSipValue(sipAmount: number, years: number, annualRate: number): number {
  if (sipAmount <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  if (monthlyRate === 0) {
    return sipAmount * months;
  }
  const fv = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(fv);
}

/**
 * Calculate lumpsum projected value
 * FV = PV * (1 + r)^y
 */
export function projectedLumpsumValue(amount: number, years: number, annualRate: number): number {
  if (amount <= 0 || years <= 0) return 0;
  return Math.round(amount * Math.pow(1 + annualRate, years));
}

/**
 * Format number as INR currency
 */
export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  });
}

/**
 * Format number as percentage
 */
export function formatPercent(n: number, decimals: number = 2): string {
  return n.toFixed(decimals) + '%';
}

/**
 * Calculate CAGR from series
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Calculate volatility (standard deviation of returns)
 */
export function calculateVolatility(series: number[]): number {
  if (series.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < series.length; i++) {
    returns.push((series[i] - series[i - 1]) / series[i - 1]);
  }
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / returns.length;

  // Annualized volatility
  return Math.sqrt(variance) * Math.sqrt(12) * 100;
}

/**
 * Calculate max drawdown
 */
export function calculateMaxDrawdown(series: number[]): number {
  if (series.length < 2) return 0;
  let maxDrawdown = 0;
  let peak = series[0];
  for (let i = 1; i < series.length; i++) {
    if (series[i] > peak) {
      peak = series[i];
    } else {
      const drawdown = (peak - series[i]) / peak * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  return maxDrawdown;
}

/**
 * Sample series data for comparison
 */
export const SAMPLE_SERIES: Record<string, number[]> = {
  NIFTY50: [100, 103, 104, 106, 108, 110, 112, 113, 115, 117, 118, 120],
  SENSEX: [100, 102, 104, 105, 107, 109, 111, 114, 116, 118, 119, 121],
  NASDAQ: [100, 105, 107, 110, 112, 114, 117, 120, 121, 123, 125, 127],
  GOLD10g: [100, 101, 103, 104, 106, 108, 109, 110, 111, 113, 115, 116],
  BTC: [100, 120, 115, 140, 135, 150, 145, 160, 170, 165, 180, 175],
  ETH: [100, 115, 110, 130, 125, 140, 135, 150, 155, 150, 165, 160],
  SOL: [100, 125, 120, 145, 140, 160, 155, 175, 180, 175, 190, 185]
};