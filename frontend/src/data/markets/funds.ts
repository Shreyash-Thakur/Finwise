export const fundCategories = ['Large Cap', 'Flexi Cap', 'Index', 'Debt - Short', 'Debt - Liquid'];
export interface NAVPoint {
  date: string;
  nav: number;
}
export interface MutualFund {
  id: string;
  name: string;
  category: string;
  risk: 'High' | 'Moderate' | 'Low';
  aumCr: number;
  expense: number;
  oneY: number;
  threeY: number;
  fiveY: number;
  nav: number;
  sipMin: number;
  navHistory?: number[];
  navSeries?: NAVPoint[]; // 60 months of NAV data
}

// Helper to generate NAV series with realistic growth
function generateNAVSeries(currentNav: number, annualReturn: number, months: number = 60): NAVPoint[] {
  const series: NAVPoint[] = [];
  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;

  // Start from 60 months ago
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Calculate starting NAV
  let nav = currentNav / Math.pow(1 + monthlyReturn, months);
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    // Add some volatility (±2% random variation)
    const volatility = (Math.random() - 0.5) * 0.04;
    nav = nav * (1 + monthlyReturn + volatility);
    series.push({
      date: date.toISOString().split('T')[0],
      nav: parseFloat(nav.toFixed(2))
    });
  }

  // Ensure last NAV matches current NAV
  series[series.length - 1].nav = currentNav;
  return series;
}
export const topFunds: MutualFund[] = [{
  id: 'F1',
  name: 'Alpha Bluechip Equity',
  category: 'Large Cap',
  risk: 'High',
  aumCr: 18200,
  expense: 1.15,
  oneY: 22.4,
  threeY: 16.2,
  fiveY: 14.1,
  nav: 38.54,
  sipMin: 500,
  navHistory: [32.1, 33.2, 34.5, 35.1, 36.2, 37.0, 36.8, 37.5, 37.9, 38.1, 38.3, 38.54],
  navSeries: generateNAVSeries(38.54, 14.1, 60)
}, {
  id: 'F2',
  name: 'Stability Flexi Cap',
  category: 'Flexi Cap',
  risk: 'Moderate',
  aumCr: 9340,
  expense: 0.95,
  oneY: 20.3,
  threeY: 14.9,
  fiveY: 13.2,
  nav: 27.18,
  sipMin: 100,
  navHistory: [22.8, 23.5, 24.1, 24.8, 25.3, 26.0, 26.2, 26.5, 26.8, 27.0, 27.1, 27.18],
  navSeries: generateNAVSeries(27.18, 13.2, 60)
}, {
  id: 'F3',
  name: 'Nifty 50 Index Fund',
  category: 'Index',
  risk: 'Moderate',
  aumCr: 15600,
  expense: 0.25,
  oneY: 18.5,
  threeY: 15.1,
  fiveY: 13.8,
  nav: 156.32,
  sipMin: 500,
  navHistory: [142, 145, 148, 150, 152, 153, 154, 155, 155.5, 156, 156.2, 156.32],
  navSeries: generateNAVSeries(156.32, 13.8, 60)
}, {
  id: 'F4',
  name: 'Growth Mid Cap Fund',
  category: 'Flexi Cap',
  risk: 'High',
  aumCr: 7850,
  expense: 1.35,
  oneY: 25.8,
  threeY: 18.4,
  fiveY: 15.6,
  nav: 45.67,
  sipMin: 1000,
  navHistory: [38.2, 39.5, 40.8, 41.5, 42.3, 43.1, 43.8, 44.2, 44.8, 45.1, 45.4, 45.67],
  navSeries: generateNAVSeries(45.67, 15.6, 60)
}, {
  id: 'F5',
  name: 'Dividend Yield Fund',
  category: 'Large Cap',
  risk: 'Moderate',
  aumCr: 5420,
  expense: 1.05,
  oneY: 19.2,
  threeY: 14.5,
  fiveY: 12.8,
  nav: 32.89,
  sipMin: 500,
  navHistory: [28.5, 29.1, 29.8, 30.2, 30.8, 31.2, 31.6, 32.0, 32.3, 32.5, 32.7, 32.89],
  navSeries: generateNAVSeries(32.89, 12.8, 60)
}, {
  id: 'F6',
  name: 'Sensex Index Fund',
  category: 'Index',
  risk: 'Moderate',
  aumCr: 12300,
  expense: 0.3,
  oneY: 17.9,
  threeY: 14.8,
  fiveY: 13.5,
  nav: 248.56,
  sipMin: 500,
  navHistory: [225, 230, 235, 238, 240, 242, 244, 245, 246, 247, 248, 248.56],
  navSeries: generateNAVSeries(248.56, 13.5, 60)
}, {
  id: 'F7',
  name: 'Short Duration Debt Fund',
  category: 'Debt - Short',
  risk: 'Low',
  aumCr: 8900,
  expense: 0.65,
  oneY: 6.8,
  threeY: 6.5,
  fiveY: 6.2,
  nav: 18.42,
  sipMin: 100,
  navHistory: [17.2, 17.4, 17.6, 17.8, 18.0, 18.1, 18.2, 18.25, 18.3, 18.35, 18.4, 18.42],
  navSeries: generateNAVSeries(18.42, 6.2, 60)
}, {
  id: 'F8',
  name: 'Liquid Fund Plus',
  category: 'Debt - Liquid',
  risk: 'Low',
  aumCr: 22500,
  expense: 0.45,
  oneY: 6.2,
  threeY: 5.9,
  fiveY: 5.7,
  nav: 3245.67,
  sipMin: 100,
  navHistory: [3180, 3195, 3210, 3220, 3225, 3230, 3235, 3238, 3240, 3242, 3244, 3245.67],
  navSeries: generateNAVSeries(3245.67, 5.7, 60)
}, {
  id: 'F9',
  name: 'Focused Equity Fund',
  category: 'Large Cap',
  risk: 'High',
  aumCr: 6780,
  expense: 1.25,
  oneY: 24.1,
  threeY: 17.3,
  fiveY: 14.8,
  nav: 52.34,
  sipMin: 1000,
  navHistory: [44.5, 46.0, 47.2, 48.1, 49.0, 49.8, 50.5, 51.0, 51.5, 51.9, 52.1, 52.34],
  navSeries: generateNAVSeries(52.34, 14.8, 60)
}, {
  id: 'F10',
  name: 'Balanced Advantage Fund',
  category: 'Flexi Cap',
  risk: 'Moderate',
  aumCr: 11200,
  expense: 0.85,
  oneY: 16.5,
  threeY: 13.2,
  fiveY: 11.8,
  nav: 34.56,
  sipMin: 500,
  navHistory: [30.2, 31.0, 31.5, 32.0, 32.5, 33.0, 33.3, 33.8, 34.0, 34.2, 34.4, 34.56],
  navSeries: generateNAVSeries(34.56, 11.8, 60)
}, {
  id: 'F11',
  name: 'Corporate Bond Fund',
  category: 'Debt - Short',
  risk: 'Low',
  aumCr: 9650,
  expense: 0.75,
  oneY: 7.2,
  threeY: 6.9,
  fiveY: 6.6,
  nav: 21.78,
  sipMin: 100,
  navHistory: [20.1, 20.4, 20.7, 20.9, 21.1, 21.3, 21.4, 21.5, 21.6, 21.65, 21.7, 21.78],
  navSeries: generateNAVSeries(21.78, 6.6, 60)
}, {
  id: 'F12',
  name: 'Overnight Fund',
  category: 'Debt - Liquid',
  risk: 'Low',
  aumCr: 18900,
  expense: 0.35,
  oneY: 5.8,
  threeY: 5.5,
  fiveY: 5.3,
  nav: 1456.89,
  sipMin: 100,
  navHistory: [1420, 1428, 1435, 1440, 1444, 1448, 1450, 1452, 1454, 1455, 1456, 1456.89],
  navSeries: generateNAVSeries(1456.89, 5.3, 60)
}, {
  id: 'F13',
  name: 'Technology Sector Fund',
  category: 'Large Cap',
  risk: 'High',
  aumCr: 4560,
  expense: 1.45,
  oneY: 28.3,
  threeY: 19.8,
  fiveY: 16.2,
  nav: 67.89,
  sipMin: 1000,
  navHistory: [56.5, 58.2, 60.0, 61.5, 63.0, 64.2, 65.0, 66.0, 66.8, 67.2, 67.5, 67.89],
  navSeries: generateNAVSeries(67.89, 16.2, 60)
}, {
  id: 'F14',
  name: 'Multi Cap Opportunity',
  category: 'Flexi Cap',
  risk: 'High',
  aumCr: 8320,
  expense: 1.15,
  oneY: 21.7,
  threeY: 15.8,
  fiveY: 13.9,
  nav: 41.23,
  sipMin: 500,
  navHistory: [35.8, 36.9, 37.8, 38.5, 39.2, 39.8, 40.2, 40.6, 40.9, 41.0, 41.1, 41.23],
  navSeries: generateNAVSeries(41.23, 13.9, 60)
}, {
  id: 'F15',
  name: 'Banking & PSU Debt',
  category: 'Debt - Short',
  risk: 'Low',
  aumCr: 7890,
  expense: 0.7,
  oneY: 6.9,
  threeY: 6.6,
  fiveY: 6.3,
  nav: 19.56,
  sipMin: 100,
  navHistory: [18.2, 18.5, 18.7, 18.9, 19.0, 19.1, 19.2, 19.3, 19.4, 19.45, 19.5, 19.56],
  navSeries: generateNAVSeries(19.56, 6.3, 60)
}, {
  id: 'F16',
  name: 'Value Discovery Fund',
  category: 'Large Cap',
  risk: 'Moderate',
  aumCr: 5670,
  expense: 1.1,
  oneY: 18.9,
  threeY: 14.2,
  fiveY: 12.5,
  nav: 29.87,
  sipMin: 500,
  navHistory: [26.0, 26.8, 27.3, 27.8, 28.2, 28.6, 28.9, 29.2, 29.4, 29.6, 29.7, 29.87],
  navSeries: generateNAVSeries(29.87, 12.5, 60)
}];