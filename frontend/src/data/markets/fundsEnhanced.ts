/**
 * Enhanced mutual funds data with rich details
 */

export interface EnhancedFund {
  id: string;
  name: string;
  category: 'Large Cap' | 'Index' | 'Flexi Cap' | 'Hybrid' | 'Debt - Short' | 'Debt - Liquid';
  risk: 'Low' | 'Moderate' | 'High';
  nav: number;
  aumCr: number;
  expense: number;
  ret1Y: number;
  ret3Y: number;
  ret5Y: number;
  amc: string;
  minSip: number;
  navSeries?: number[]; // For detailed view
}
export const ENHANCED_FUNDS: EnhancedFund[] = [{
  id: 'hdfc-n50',
  name: 'HDFC Nifty 50 Index Fund (Direct-G)',
  category: 'Index',
  risk: 'Moderate',
  nav: 248.56,
  aumCr: 12300,
  expense: 0.3,
  ret1Y: 17.9,
  ret3Y: 14.8,
  ret5Y: 13.5,
  amc: 'HDFC',
  minSip: 500,
  navSeries: [220, 225, 230, 235, 238, 240, 242, 244, 245, 246, 247, 248.56]
}, {
  id: 'sbi-n50',
  name: 'SBI Nifty 50 Index Fund (Direct-G)',
  category: 'Index',
  risk: 'Moderate',
  nav: 156.32,
  aumCr: 15600,
  expense: 0.25,
  ret1Y: 18.5,
  ret3Y: 15.1,
  ret5Y: 13.8,
  amc: 'SBI',
  minSip: 500,
  navSeries: [138, 142, 145, 148, 150, 152, 153, 154, 155, 155.5, 156, 156.32]
}, {
  id: 'icici-n50',
  name: 'ICICI Prudential Nifty 50 Index (Direct-G)',
  category: 'Index',
  risk: 'Moderate',
  nav: 189.87,
  aumCr: 5670,
  expense: 0.27,
  ret1Y: 18.9,
  ret3Y: 14.2,
  ret5Y: 12.5,
  amc: 'ICICI Prudential',
  minSip: 1000,
  navSeries: [168, 172, 175, 178, 180, 182, 184, 186, 187, 188, 189, 189.87]
}, {
  id: 'balanced-adv',
  name: 'Balanced Advantage Fund (Direct-G)',
  category: 'Hybrid',
  risk: 'Moderate',
  nav: 34.56,
  aumCr: 11200,
  expense: 0.85,
  ret1Y: 16.5,
  ret3Y: 13.2,
  ret5Y: 11.8,
  amc: 'HDFC',
  minSip: 500,
  navSeries: [30.2, 31.0, 31.5, 32.0, 32.5, 33.0, 33.3, 33.8, 34.0, 34.2, 34.4, 34.56]
}, {
  id: 'corp-bond',
  name: 'Corporate Bond Fund (Direct-G)',
  category: 'Debt - Short',
  risk: 'Low',
  nav: 21.78,
  aumCr: 9650,
  expense: 0.75,
  ret1Y: 7.2,
  ret3Y: 6.9,
  ret5Y: 6.6,
  amc: 'ICICI Prudential',
  minSip: 100,
  navSeries: [20.1, 20.4, 20.7, 20.9, 21.1, 21.3, 21.4, 21.5, 21.6, 21.65, 21.7, 21.78]
}, {
  id: 'alpha-bluechip',
  name: 'Alpha Bluechip Equity Fund (Direct-G)',
  category: 'Large Cap',
  risk: 'High',
  nav: 38.54,
  aumCr: 18200,
  expense: 1.15,
  ret1Y: 22.4,
  ret3Y: 16.2,
  ret5Y: 14.1,
  amc: 'Alpha',
  minSip: 500,
  navSeries: [32.1, 33.2, 34.5, 35.1, 36.2, 37.0, 36.8, 37.5, 37.9, 38.1, 38.3, 38.54]
}, {
  id: 'growth-midcap',
  name: 'Growth Mid Cap Fund (Direct-G)',
  category: 'Flexi Cap',
  risk: 'High',
  nav: 45.67,
  aumCr: 7850,
  expense: 1.35,
  ret1Y: 25.8,
  ret3Y: 18.4,
  ret5Y: 15.6,
  amc: 'Growth',
  minSip: 1000,
  navSeries: [38.2, 39.5, 40.8, 41.5, 42.3, 43.1, 43.8, 44.2, 44.8, 45.1, 45.4, 45.67]
}, {
  id: 'liquid-plus',
  name: 'Liquid Fund Plus (Direct-G)',
  category: 'Debt - Liquid',
  risk: 'Low',
  nav: 3245.67,
  aumCr: 22500,
  expense: 0.45,
  ret1Y: 6.2,
  ret3Y: 5.9,
  ret5Y: 5.7,
  amc: 'SBI',
  minSip: 100,
  navSeries: [3180, 3195, 3210, 3220, 3225, 3230, 3235, 3238, 3240, 3242, 3244, 3245.67]
}];