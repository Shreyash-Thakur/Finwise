export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  ch24h: number;
  ch7d: number;
  mcapCr: number;
  volume24h: number;
  spark: number[];
}
export const cryptoList: Crypto[] = [{
  id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  priceINR: 5329230,
  priceUSD: 64210,
  ch24h: -1.2,
  ch7d: 3.5,
  mcapCr: 56000,
  volume24h: 28500,
  spark: [62000, 62500, 63000, 62800, 63500, 64000, 64500, 64200, 63800, 64100, 64300, 64210]
}, {
  id: 'ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  priceINR: 286350,
  priceUSD: 3450,
  ch24h: 0.8,
  ch7d: 5.2,
  mcapCr: 18400,
  volume24h: 15200,
  spark: [3300, 3320, 3350, 3380, 3400, 3420, 3440, 3460, 3450, 3455, 3448, 3450]
}, {
  id: 'binancecoin',
  symbol: 'BNB',
  name: 'BNB',
  priceINR: 49800,
  priceUSD: 600,
  ch24h: -0.5,
  ch7d: 2.1,
  mcapCr: 8900,
  volume24h: 1200,
  spark: [595, 598, 602, 605, 608, 606, 604, 602, 600, 599, 601, 600]
}, {
  id: 'solana',
  symbol: 'SOL',
  name: 'Solana',
  priceINR: 14940,
  priceUSD: 180,
  ch24h: 2.3,
  ch7d: 8.7,
  mcapCr: 7200,
  volume24h: 2800,
  spark: [165, 168, 172, 175, 178, 180, 182, 181, 179, 180, 181, 180]
}, {
  id: 'ripple',
  symbol: 'XRP',
  name: 'XRP',
  priceINR: 45.65,
  priceUSD: 0.55,
  ch24h: -1.8,
  ch7d: -2.3,
  mcapCr: 3100,
  volume24h: 1500,
  spark: [0.56, 0.565, 0.57, 0.56, 0.555, 0.552, 0.548, 0.545, 0.55, 0.552, 0.553, 0.55]
}, {
  id: 'cardano',
  symbol: 'ADA',
  name: 'Cardano',
  priceINR: 37.35,
  priceUSD: 0.45,
  ch24h: 1.2,
  ch7d: 4.5,
  mcapCr: 1580,
  volume24h: 420,
  spark: [0.43, 0.435, 0.44, 0.442, 0.445, 0.448, 0.45, 0.452, 0.451, 0.45, 0.449, 0.45]
}, {
  id: 'dogecoin',
  symbol: 'DOGE',
  name: 'Dogecoin',
  priceINR: 11.62,
  priceUSD: 0.14,
  ch24h: -2.1,
  ch7d: 1.2,
  mcapCr: 2050,
  volume24h: 850,
  spark: [0.142, 0.143, 0.145, 0.144, 0.143, 0.141, 0.14, 0.139, 0.14, 0.141, 0.14, 0.14]
}, {
  id: 'polkadot',
  symbol: 'DOT',
  name: 'Polkadot',
  priceINR: 498,
  priceUSD: 6.0,
  ch24h: 0.5,
  ch7d: 3.8,
  mcapCr: 890,
  volume24h: 280,
  spark: [5.8, 5.85, 5.9, 5.92, 5.95, 5.98, 6.0, 6.02, 6.01, 6.0, 5.99, 6.0]
}, {
  id: 'polygon',
  symbol: 'MATIC',
  name: 'Polygon',
  priceINR: 58.45,
  priceUSD: 0.705,
  ch24h: 1.8,
  ch7d: 6.2,
  mcapCr: 680,
  volume24h: 320,
  spark: [0.66, 0.67, 0.68, 0.685, 0.69, 0.695, 0.7, 0.705, 0.708, 0.706, 0.704, 0.705]
}, {
  id: 'chainlink',
  symbol: 'LINK',
  name: 'Chainlink',
  priceINR: 1245,
  priceUSD: 15.0,
  ch24h: -0.8,
  ch7d: 2.5,
  mcapCr: 890,
  volume24h: 450,
  spark: [14.8, 14.9, 15.0, 15.1, 15.2, 15.15, 15.1, 15.05, 15.0, 14.98, 15.0, 15.0]
}, {
  id: 'litecoin',
  symbol: 'LTC',
  name: 'Litecoin',
  priceINR: 7470,
  priceUSD: 90,
  ch24h: -1.5,
  ch7d: 1.8,
  mcapCr: 680,
  volume24h: 580,
  spark: [91, 91.5, 92, 91.5, 91, 90.5, 90, 89.5, 90, 90.2, 90.1, 90]
}, {
  id: 'avalanche',
  symbol: 'AVAX',
  name: 'Avalanche',
  priceINR: 2905,
  priceUSD: 35,
  ch24h: 2.8,
  ch7d: 7.5,
  mcapCr: 1320,
  volume24h: 620,
  spark: [32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 35.2, 35.1, 35.0, 35]
}];