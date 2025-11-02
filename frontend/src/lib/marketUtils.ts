// Currency formatting
export const fmtINR = (n: number): string => {
  return '₹' + n.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  });
};
export const fmtUSD = (n: number): string => {
  return '$' + n.toLocaleString('en-US', {
    maximumFractionDigits: 2
  });
};

// Percentage formatting
export const pct = (p: number): string => {
  return `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
};
export const pctAbs = (p: number): string => {
  return `${p.toFixed(2)}%`;
};

// Number abbreviations
export const abbr = (n: number): string => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)}Cr`; // Crores
  if (n >= 100000) return `${(n / 100000).toFixed(2)}L`; // Lakhs
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return n.toFixed(2);
};
export const abbrUS = (n: number): string => {
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return n.toFixed(2);
};

// Simple sparkline generator (returns SVG path string)
export const generateSparklinePath = (data: number[], width: number = 100, height: number = 30): string => {
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const xStep = width / (data.length - 1);
  const points = data.map((value, index) => {
    const x = index * xStep;
    const y = height - (value - min) / range * height;
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
};

// Calculate simple returns
export const calculateReturn = (initial: number, final: number): number => {
  return (final - initial) / initial * 100;
};

// SIP Future Value calculation
export const calculateSIPFV = (monthlyAmount: number, tenureMonths: number, annualReturn: number): number => {
  const monthlyRate = annualReturn / 12 / 100;
  const fv = monthlyAmount * ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(fv);
};

// Lumpsum Future Value calculation
export const calculateLumpsumFV = (principal: number, years: number, annualReturn: number): number => {
  const fv = principal * Math.pow(1 + annualReturn / 100, years);
  return Math.round(fv);
};

// CAGR calculation
export const calculateCAGR = (initial: number, final: number, years: number): number => {
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
};

// Standard deviation (for volatility)
export const calculateStdDev = (values: number[]): number => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
};

// Format date
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};