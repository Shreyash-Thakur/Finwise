/**
 * Comparison helpers for asset comparison page
 */

export type AssetKey = 'NIFTY50' | 'SENSEX' | 'NASDAQ100' | 'SP500' | 'GOLD10G' | 'BTC' | 'ETH' | 'SOL' | 'HDFC_N50' | 'SBI_N50' | 'ICICI_N50';
export interface AssetOption {
  key: AssetKey;
  label: string;
  type: 'index' | 'crypto' | 'fund';
}
export const ASSET_OPTIONS: AssetOption[] = [
// Indices
{
  key: 'NIFTY50',
  label: 'NIFTY 50',
  type: 'index'
}, {
  key: 'SENSEX',
  label: 'SENSEX',
  type: 'index'
}, {
  key: 'NASDAQ100',
  label: 'NASDAQ 100',
  type: 'index'
}, {
  key: 'SP500',
  label: 'S&P 500',
  type: 'index'
}, {
  key: 'GOLD10G',
  label: 'Gold (10g INR)',
  type: 'index'
},
// Crypto
{
  key: 'BTC',
  label: 'Bitcoin (BTC)',
  type: 'crypto'
}, {
  key: 'ETH',
  label: 'Ethereum (ETH)',
  type: 'crypto'
}, {
  key: 'SOL',
  label: 'Solana (SOL)',
  type: 'crypto'
},
// Top Mutual Funds
{
  key: 'HDFC_N50',
  label: 'HDFC Nifty 50 Index Fund – Direct-G',
  type: 'fund'
}, {
  key: 'SBI_N50',
  label: 'SBI Nifty 50 Index Fund – Direct-G',
  type: 'fund'
}, {
  key: 'ICICI_N50',
  label: 'ICICI Prudential Nifty 50 Index Fund – Direct-G',
  type: 'fund'
}];
export const SERIES: Record<AssetKey, number[]> = {
  NIFTY50: [100, 103, 104, 106, 108, 110, 112, 113, 115, 117, 118, 120],
  SENSEX: [100, 102, 104, 105, 107, 109, 111, 114, 116, 118, 119, 121],
  NASDAQ100: [100, 105, 107, 110, 112, 114, 117, 120, 121, 123, 125, 127],
  SP500: [100, 103, 104, 106, 107, 109, 111, 113, 114, 116, 118, 119],
  GOLD10G: [100, 101, 103, 104, 106, 108, 109, 110, 111, 113, 115, 116],
  BTC: [100, 120, 115, 140, 135, 150, 145, 160, 170, 165, 180, 175],
  ETH: [100, 115, 110, 130, 125, 140, 150, 145, 155, 160, 165, 170],
  SOL: [100, 112, 108, 125, 120, 138, 130, 150, 160, 158, 170, 168],
  HDFC_N50: [100, 103, 105, 107, 109, 111, 113, 115, 116, 118, 120, 122],
  SBI_N50: [100, 104, 106, 108, 110, 112, 114, 116, 117, 119, 121, 123],
  ICICI_N50: [100, 104, 106, 107, 109, 110, 112, 114, 116, 118, 119, 121]
};
export interface AssetStats {
  cagr?: number;
  vol?: number;
  mdd?: number;
  expense?: number;
  aumCr?: number;
}
export type StatsMap = Partial<Record<AssetKey, AssetStats>>;
export const STATS: StatsMap = {
  NIFTY50: {
    cagr: 17.9,
    vol: 18.5,
    mdd: 15.2
  },
  SENSEX: {
    cagr: 17.5,
    vol: 17.8,
    mdd: 14.8
  },
  NASDAQ100: {
    cagr: 28.5,
    vol: 22.5,
    mdd: 22.3
  },
  SP500: {
    cagr: 19.2,
    vol: 19.8,
    mdd: 18.5
  },
  GOLD10G: {
    cagr: 7.8,
    vol: 12.5,
    mdd: 8.5
  },
  BTC: {
    cagr: 65.2,
    vol: 65.5,
    mdd: 45.2
  },
  ETH: {
    cagr: 58.5,
    vol: 72.3,
    mdd: 52.8
  },
  SOL: {
    cagr: 72.5,
    vol: 85.5,
    mdd: 62.5
  },
  HDFC_N50: {
    cagr: 17.9,
    vol: 18.2,
    mdd: 14.9,
    expense: 0.3,
    aumCr: 12300
  },
  SBI_N50: {
    cagr: 18.5,
    vol: 18.3,
    mdd: 15.1,
    expense: 0.25,
    aumCr: 15600
  },
  ICICI_N50: {
    cagr: 18.9,
    vol: 18.5,
    mdd: 15.3,
    expense: 0.27,
    aumCr: 5670
  }
};

/**
 * Get distinct values from array
 */
export function distinct<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Check if array contains only finite numbers
 */
export function isFiniteArray(arr: number[]): boolean {
  return Array.isArray(arr) && arr.length > 0 && arr.every(n => Number.isFinite(n));
}

/**
 * Normalize array to base 100
 */
export function normalize(arr: number[]): number[] {
  if (!arr?.length || !Number.isFinite(arr[0])) return [];
  const base = arr[0] === 0 ? 1 : arr[0];
  return arr.map(v => v / base * 100);
}

/**
 * Align arrays to same length (use minimum length)
 */
export function alignLength(arrays: number[][]): number[][] {
  if (!arrays.length) return [];
  const min = Math.min(...arrays.map(a => a.length));
  return arrays.map(a => a.slice(0, min));
}

/**
 * Get number of months for range
 */
export function monthsForRange(r: '1Y' | '3Y' | '5Y' | '10Y'): number {
  return {
    '1Y': 12,
    '3Y': 36,
    '5Y': 60,
    '10Y': 120
  }[r];
}

/**
 * Format percentage with fallback
 */
export function toPct(n: number | undefined): string {
  return n == null ? '—' : `${n.toFixed(2)}%`;
}

/**
 * Format INR with abbreviation
 */
export function toINR(n: number | undefined): string {
  if (n == null) return '—';
  if (n >= 10000) return `₹${(n / 10000).toFixed(2)}Cr`;
  if (n >= 100) return `₹${(n / 100).toFixed(2)}L`;
  return `₹${n.toFixed(2)}`;
}