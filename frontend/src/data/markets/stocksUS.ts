export interface StockUS {
  symbol: string;
  name: string;
  price: number;
  ch1d: number;
  ch1w: number;
  pe: number;
  mcapBn: number;
  sector: string;
  spark: number[];
}
export const stocksUS: StockUS[] = [{
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 226.4,
  ch1d: 0.5,
  ch1w: 2.3,
  pe: 33.1,
  mcapBn: 3500,
  sector: 'Technology',
  spark: [222, 223, 224, 225, 225.5, 226, 226.2, 226.3, 226.4, 226.3, 226.4, 226.4]
}, {
  symbol: 'NVDA',
  name: 'NVIDIA Corp',
  price: 118.2,
  ch1d: -1.2,
  ch1w: 3.8,
  pe: 45.2,
  mcapBn: 3000,
  sector: 'Semiconductors',
  spark: [115, 116, 117, 118, 119, 120, 119.5, 119, 118.5, 118.2, 118.3, 118.2]
}, {
  symbol: 'MSFT',
  name: 'Microsoft Corp',
  price: 415.8,
  ch1d: 0.8,
  ch1w: 1.9,
  pe: 36.5,
  mcapBn: 3100,
  sector: 'Technology',
  spark: [410, 411, 412, 413, 414, 414.5, 415, 415.5, 415.6, 415.7, 415.8, 415.8]
}, {
  symbol: 'GOOGL',
  name: 'Alphabet Inc',
  price: 168.5,
  ch1d: 0.3,
  ch1w: 1.5,
  pe: 28.2,
  mcapBn: 2100,
  sector: 'Technology',
  spark: [166, 166.5, 167, 167.5, 168, 168.2, 168.3, 168.4, 168.5, 168.5, 168.5, 168.5]
}, {
  symbol: 'AMZN',
  name: 'Amazon.com Inc',
  price: 178.9,
  ch1d: 1.1,
  ch1w: 2.8,
  pe: 52.8,
  mcapBn: 1850,
  sector: 'Consumer',
  spark: [174, 175, 176, 177, 177.5, 178, 178.5, 178.7, 178.8, 178.9, 178.9, 178.9]
}, {
  symbol: 'META',
  name: 'Meta Platforms',
  price: 512.3,
  ch1d: -0.5,
  ch1w: 2.1,
  pe: 28.5,
  mcapBn: 1300,
  sector: 'Technology',
  spark: [508, 509, 510, 511, 512, 513, 512.5, 512.3, 512.2, 512.3, 512.3, 512.3]
}, {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  price: 248.7,
  ch1d: 2.3,
  ch1w: 5.2,
  pe: 68.5,
  mcapBn: 790,
  sector: 'Auto',
  spark: [235, 238, 240, 242, 244, 245, 246, 247, 248, 248.5, 248.7, 248.7]
}, {
  symbol: 'BRK.B',
  name: 'Berkshire Hathaway',
  price: 445.6,
  ch1d: 0.2,
  ch1w: 0.8,
  pe: 9.2,
  mcapBn: 980,
  sector: 'Financial',
  spark: [443, 443.5, 444, 444.5, 445, 445.2, 445.4, 445.5, 445.6, 445.6, 445.6, 445.6]
}, {
  symbol: 'JPM',
  name: 'JPMorgan Chase',
  price: 198.4,
  ch1d: 0.6,
  ch1w: 1.5,
  pe: 11.8,
  mcapBn: 580,
  sector: 'Financial',
  spark: [195, 196, 196.5, 197, 197.5, 198, 198.2, 198.3, 198.4, 198.4, 198.4, 198.4]
}, {
  symbol: 'V',
  name: 'Visa Inc',
  price: 278.9,
  ch1d: 0.4,
  ch1w: 1.2,
  pe: 32.5,
  mcapBn: 580,
  sector: 'Financial',
  spark: [276, 277, 277.5, 278, 278.3, 278.5, 278.7, 278.8, 278.9, 278.9, 278.9, 278.9]
}, {
  symbol: 'WMT',
  name: 'Walmart Inc',
  price: 67.8,
  ch1d: -0.3,
  ch1w: 0.5,
  pe: 28.2,
  mcapBn: 540,
  sector: 'Retail',
  spark: [67.5, 67.6, 67.7, 67.8, 67.9, 67.9, 67.8, 67.8, 67.8, 67.8, 67.8, 67.8]
}, {
  symbol: 'JNJ',
  name: 'Johnson & Johnson',
  price: 156.3,
  ch1d: 0.1,
  ch1w: 0.8,
  pe: 24.5,
  mcapBn: 380,
  sector: 'Healthcare',
  spark: [155, 155.3, 155.6, 155.8, 156, 156.1, 156.2, 156.2, 156.3, 156.3, 156.3, 156.3]
}, {
  symbol: 'PG',
  name: 'Procter & Gamble',
  price: 168.9,
  ch1d: 0.3,
  ch1w: 1.1,
  pe: 26.8,
  mcapBn: 400,
  sector: 'Consumer',
  spark: [167, 167.5, 168, 168.2, 168.5, 168.6, 168.7, 168.8, 168.9, 168.9, 168.9, 168.9]
}, {
  symbol: 'MA',
  name: 'Mastercard Inc',
  price: 478.5,
  ch1d: 0.7,
  ch1w: 1.8,
  pe: 38.2,
  mcapBn: 450,
  sector: 'Financial',
  spark: [472, 474, 475, 476, 477, 477.5, 478, 478.2, 478.4, 478.5, 478.5, 478.5]
}, {
  symbol: 'HD',
  name: 'Home Depot',
  price: 389.6,
  ch1d: 0.5,
  ch1w: 1.3,
  pe: 24.5,
  mcapBn: 390,
  sector: 'Retail',
  spark: [385, 386, 387, 388, 388.5, 389, 389.2, 389.4, 389.5, 389.6, 389.6, 389.6]
}, {
  symbol: 'DIS',
  name: 'Walt Disney',
  price: 112.8,
  ch1d: 1.2,
  ch1w: 2.5,
  pe: 42.5,
  mcapBn: 205,
  sector: 'Entertainment',
  spark: [108, 109, 110, 111, 111.5, 112, 112.3, 112.5, 112.7, 112.8, 112.8, 112.8]
}, {
  symbol: 'NFLX',
  name: 'Netflix Inc',
  price: 645.2,
  ch1d: -0.8,
  ch1w: 1.5,
  pe: 48.5,
  mcapBn: 280,
  sector: 'Entertainment',
  spark: [640, 642, 644, 645, 646, 647, 646.5, 646, 645.5, 645.2, 645.2, 645.2]
}, {
  symbol: 'INTC',
  name: 'Intel Corp',
  price: 23.4,
  ch1d: -1.5,
  ch1w: -2.8,
  pe: 15.2,
  mcapBn: 98,
  sector: 'Semiconductors',
  spark: [24.5, 24.2, 24, 23.8, 23.6, 23.5, 23.4, 23.3, 23.4, 23.4, 23.4, 23.4]
}, {
  symbol: 'AMD',
  name: 'Advanced Micro Devices',
  price: 168.9,
  ch1d: 1.8,
  ch1w: 4.2,
  pe: 185.2,
  mcapBn: 272,
  sector: 'Semiconductors',
  spark: [160, 162, 164, 165, 166, 167, 167.5, 168, 168.5, 168.7, 168.9, 168.9]
}, {
  symbol: 'CRM',
  name: 'Salesforce Inc',
  price: 278.4,
  ch1d: 0.9,
  ch1w: 2.1,
  pe: 52.8,
  mcapBn: 272,
  sector: 'Technology',
  spark: [272, 274, 275, 276, 277, 277.5, 278, 278.2, 278.3, 278.4, 278.4, 278.4]
}];