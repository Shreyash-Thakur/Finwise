export interface StockIN {
  symbol: string;
  name: string;
  ltp: number;
  ch1d: number;
  ch1w: number;
  pe: number;
  mcapCr: number;
  sector: string;
  spark: number[];
}
export const stocksIN: StockIN[] = [{
  symbol: 'TCS',
  name: 'Tata Consultancy Services',
  ltp: 3921,
  ch1d: 0.7,
  ch1w: 2.3,
  pe: 29.5,
  mcapCr: 1480000,
  sector: 'IT',
  spark: [3850, 3870, 3890, 3880, 3900, 3910, 3920, 3915, 3918, 3920, 3919, 3921]
}, {
  symbol: 'RELIANCE',
  name: 'Reliance Industries',
  ltp: 2895,
  ch1d: -0.4,
  ch1w: 1.2,
  pe: 24.2,
  mcapCr: 1930000,
  sector: 'Energy',
  spark: [2880, 2890, 2900, 2910, 2905, 2900, 2895, 2890, 2892, 2895, 2897, 2895]
}, {
  symbol: 'HDFCBANK',
  name: 'HDFC Bank',
  ltp: 1642,
  ch1d: 0.5,
  ch1w: 1.8,
  pe: 18.5,
  mcapCr: 1250000,
  sector: 'Banking',
  spark: [1620, 1625, 1630, 1635, 1638, 1640, 1642, 1641, 1640, 1641, 1642, 1642]
}, {
  symbol: 'INFY',
  name: 'Infosys',
  ltp: 1456,
  ch1d: 1.2,
  ch1w: 3.5,
  pe: 26.8,
  mcapCr: 605000,
  sector: 'IT',
  spark: [1420, 1430, 1435, 1440, 1445, 1448, 1450, 1452, 1454, 1455, 1456, 1456]
}, {
  symbol: 'ICICIBANK',
  name: 'ICICI Bank',
  ltp: 1089,
  ch1d: -0.3,
  ch1w: 0.8,
  pe: 17.2,
  mcapCr: 765000,
  sector: 'Banking',
  spark: [1080, 1082, 1085, 1087, 1090, 1092, 1091, 1090, 1089, 1088, 1089, 1089]
}, {
  symbol: 'BHARTIARTL',
  name: 'Bharti Airtel',
  ltp: 1234,
  ch1d: 0.9,
  ch1w: 2.1,
  pe: 32.4,
  mcapCr: 720000,
  sector: 'Telecom',
  spark: [1210, 1215, 1220, 1222, 1225, 1228, 1230, 1232, 1233, 1234, 1234, 1234]
}, {
  symbol: 'ITC',
  name: 'ITC Limited',
  ltp: 445,
  ch1d: -0.2,
  ch1w: 1.5,
  pe: 28.9,
  mcapCr: 555000,
  sector: 'FMCG',
  spark: [440, 442, 443, 444, 445, 446, 445, 444, 445, 445, 445, 445]
}, {
  symbol: 'SBIN',
  name: 'State Bank of India',
  ltp: 789,
  ch1d: 1.5,
  ch1w: 3.2,
  pe: 12.5,
  mcapCr: 705000,
  sector: 'Banking',
  spark: [765, 770, 775, 778, 780, 782, 785, 787, 788, 789, 789, 789]
}, {
  symbol: 'HINDUNILVR',
  name: 'Hindustan Unilever',
  ltp: 2567,
  ch1d: 0.3,
  ch1w: 1.1,
  pe: 58.2,
  mcapCr: 605000,
  sector: 'FMCG',
  spark: [2550, 2555, 2558, 2560, 2562, 2564, 2565, 2566, 2567, 2567, 2567, 2567]
}, {
  symbol: 'LT',
  name: 'Larsen & Toubro',
  ltp: 3456,
  ch1d: 0.8,
  ch1w: 2.5,
  pe: 31.2,
  mcapCr: 485000,
  sector: 'Infrastructure',
  spark: [3400, 3410, 3420, 3430, 3440, 3445, 3450, 3452, 3454, 3455, 3456, 3456]
}, {
  symbol: 'AXISBANK',
  name: 'Axis Bank',
  ltp: 1123,
  ch1d: -0.5,
  ch1w: 0.5,
  pe: 14.8,
  mcapCr: 345000,
  sector: 'Banking',
  spark: [1120, 1122, 1124, 1125, 1126, 1125, 1124, 1123, 1123, 1123, 1123, 1123]
}, {
  symbol: 'ASIANPAINT',
  name: 'Asian Paints',
  ltp: 2890,
  ch1d: 0.4,
  ch1w: 1.8,
  pe: 52.3,
  mcapCr: 278000,
  sector: 'Consumer',
  spark: [2860, 2865, 2870, 2875, 2880, 2882, 2885, 2887, 2889, 2890, 2890, 2890]
}, {
  symbol: 'MARUTI',
  name: 'Maruti Suzuki',
  ltp: 12345,
  ch1d: 1.1,
  ch1w: 2.8,
  pe: 28.5,
  mcapCr: 373000,
  sector: 'Auto',
  spark: [12100, 12150, 12200, 12250, 12280, 12300, 12320, 12330, 12340, 12342, 12345, 12345]
}, {
  symbol: 'TITAN',
  name: 'Titan Company',
  ltp: 3234,
  ch1d: 0.6,
  ch1w: 2.2,
  pe: 78.5,
  mcapCr: 287000,
  sector: 'Consumer',
  spark: [3180, 3190, 3200, 3210, 3215, 3220, 3225, 3228, 3230, 3232, 3234, 3234]
}, {
  symbol: 'SUNPHARMA',
  name: 'Sun Pharmaceutical',
  ltp: 1567,
  ch1d: -0.3,
  ch1w: 0.9,
  pe: 35.2,
  mcapCr: 376000,
  sector: 'Pharma',
  spark: [1560, 1562, 1564, 1565, 1566, 1567, 1568, 1567, 1567, 1567, 1567, 1567]
}, {
  symbol: 'WIPRO',
  name: 'Wipro',
  ltp: 456,
  ch1d: 0.9,
  ch1w: 2.5,
  pe: 22.8,
  mcapCr: 248000,
  sector: 'IT',
  spark: [445, 448, 450, 452, 453, 454, 455, 455, 456, 456, 456, 456]
}, {
  symbol: 'ULTRACEMCO',
  name: 'UltraTech Cement',
  ltp: 9876,
  ch1d: 0.5,
  ch1w: 1.5,
  pe: 42.5,
  mcapCr: 285000,
  sector: 'Cement',
  spark: [9750, 9780, 9800, 9820, 9840, 9850, 9860, 9865, 9870, 9875, 9876, 9876]
}, {
  symbol: 'BAJFINANCE',
  name: 'Bajaj Finance',
  ltp: 6789,
  ch1d: 1.3,
  ch1w: 3.1,
  pe: 32.5,
  mcapCr: 418000,
  sector: 'NBFC',
  spark: [6600, 6650, 6680, 6700, 6720, 6740, 6760, 6770, 6780, 6785, 6789, 6789]
}, {
  symbol: 'HCLTECH',
  name: 'HCL Technologies',
  ltp: 1234,
  ch1d: 0.7,
  ch1w: 2.0,
  pe: 24.2,
  mcapCr: 335000,
  sector: 'IT',
  spark: [1210, 1215, 1220, 1222, 1225, 1228, 1230, 1232, 1233, 1234, 1234, 1234]
}, {
  symbol: 'KOTAKBANK',
  name: 'Kotak Mahindra Bank',
  ltp: 1789,
  ch1d: -0.4,
  ch1w: 0.8,
  pe: 16.8,
  mcapCr: 355000,
  sector: 'Banking',
  spark: [1780, 1782, 1785, 1787, 1790, 1791, 1790, 1789, 1789, 1789, 1789, 1789]
}];