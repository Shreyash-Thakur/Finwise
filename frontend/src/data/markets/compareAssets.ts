/**
 * Assets available for comparison (restricted universe)
 */

export interface CompareAsset {
  id: string;
  name: string;
  type: 'index' | 'crypto' | 'commodity' | 'fund';
  currency: 'INR' | 'USD';
}
export const COMPARE_ASSETS: CompareAsset[] = [
// Indices
{
  id: 'NIFTY50',
  name: 'NIFTY 50',
  type: 'index',
  currency: 'INR'
}, {
  id: 'SENSEX',
  name: 'SENSEX',
  type: 'index',
  currency: 'INR'
}, {
  id: 'NASDAQ',
  name: 'NASDAQ 100',
  type: 'index',
  currency: 'USD'
}, {
  id: 'SP500',
  name: 'S&P 500',
  type: 'index',
  currency: 'USD'
},
// Crypto
{
  id: 'BTC',
  name: 'Bitcoin (BTC)',
  type: 'crypto',
  currency: 'INR'
}, {
  id: 'ETH',
  name: 'Ethereum (ETH)',
  type: 'crypto',
  currency: 'INR'
}, {
  id: 'SOL',
  name: 'Solana (SOL)',
  type: 'crypto',
  currency: 'INR'
},
// Commodities
{
  id: 'GOLD10g',
  name: 'Gold (10g INR)',
  type: 'commodity',
  currency: 'INR'
},
// Top Mutual Funds by AUM
{
  id: 'hdfc-n50',
  name: 'HDFC Nifty 50 Index Fund – Direct Plan – Growth',
  type: 'fund',
  currency: 'INR'
}, {
  id: 'sbi-n50',
  name: 'SBI Nifty 50 Index Fund – Direct Plan – Growth',
  type: 'fund',
  currency: 'INR'
}, {
  id: 'icici-n50',
  name: 'ICICI Prudential Nifty 50 Index Fund – Direct Plan – Growth',
  type: 'fund',
  currency: 'INR'
}];
export const COMPARE_DATA: Record<string, {
  cagr: {
    one: number;
    three: number;
    five: number;
    ten?: number;
  };
  volatility: number;
  maxDrawdown: number;
  expense?: number;
  aumCr?: number;
}> = {
  NIFTY50: {
    cagr: {
      one: 0.179,
      three: 0.148,
      five: 0.135,
      ten: 0.125
    },
    volatility: 18.5,
    maxDrawdown: 15.2
  },
  SENSEX: {
    cagr: {
      one: 0.175,
      three: 0.145,
      five: 0.132,
      ten: 0.122
    },
    volatility: 17.8,
    maxDrawdown: 14.8
  },
  NASDAQ: {
    cagr: {
      one: 0.285,
      three: 0.195,
      five: 0.165,
      ten: 0.155
    },
    volatility: 22.5,
    maxDrawdown: 22.3
  },
  GOLD10g: {
    cagr: {
      one: 0.078,
      three: 0.085,
      five: 0.082,
      ten: 0.075
    },
    volatility: 12.5,
    maxDrawdown: 8.5
  },
  BTC: {
    cagr: {
      one: 0.652,
      three: 0.425,
      five: 0.385
    },
    volatility: 65.5,
    maxDrawdown: 45.2
  },
  ETH: {
    cagr: {
      one: 0.585,
      three: 0.395,
      five: 0.355
    },
    volatility: 72.3,
    maxDrawdown: 52.8
  },
  SOL: {
    cagr: {
      one: 0.725,
      three: 0.485,
      five: 0.425
    },
    volatility: 85.5,
    maxDrawdown: 62.5
  },
  'hdfc-n50': {
    cagr: {
      one: 0.179,
      three: 0.148,
      five: 0.135,
      ten: 0.125
    },
    volatility: 18.2,
    maxDrawdown: 14.9,
    expense: 0.3,
    aumCr: 12300
  },
  'sbi-n50': {
    cagr: {
      one: 0.185,
      three: 0.151,
      five: 0.138,
      ten: 0.128
    },
    volatility: 18.3,
    maxDrawdown: 15.1,
    expense: 0.25,
    aumCr: 15600
  },
  'icici-n50': {
    cagr: {
      one: 0.189,
      three: 0.142,
      five: 0.125,
      ten: 0.118
    },
    volatility: 18.5,
    maxDrawdown: 15.3,
    expense: 0.27,
    aumCr: 5670
  }
};