export const user = {
  id: 'u1',
  name: 'Shreyash',
  email: 'user@example.com',
  riskProfile: 'Moderate',
  emergencyMonthsTarget: 6,
  emergencyMonthsCurrent: 4.2
};
export const plan = {
  monthlyIncome: 85000,
  splitMonthly: {
    needs: 35000,
    emergency: 8000,
    debt: 6000,
    investments: 36000
  },
  allocationPct: {
    equity: 65,
    debt: 25,
    gold: 8,
    reit: 2,
    crypto: 0
  }
};
export const goals = [{
  id: 'g1',
  name: 'Home Down Payment',
  target: 1500000,
  saved: 480000,
  deadline: '2028-06-01',
  sip: 12000,
  priority: 'High',
  category: 'Property'
}, {
  id: 'g2',
  name: 'Travel 2026',
  target: 250000,
  saved: 112500,
  deadline: '2026-12-01',
  sip: 4500,
  priority: 'Medium',
  category: 'Lifestyle'
}, {
  id: 'g3',
  name: 'Education Fund',
  target: 800000,
  saved: 240000,
  deadline: '2027-08-01',
  sip: 8000,
  priority: 'High',
  category: 'Education'
}];
export const holdings = [{
  asset: 'Equity',
  invested: 520000,
  sip: 18000,
  returnPct: 11.2
}, {
  asset: 'Debt',
  invested: 210000,
  sip: 7000,
  returnPct: 6.5
}, {
  asset: 'Gold',
  invested: 65000,
  sip: 2500,
  returnPct: 7.8
}, {
  asset: 'REIT',
  invested: 30000,
  sip: 1500,
  returnPct: 5.9
}, {
  asset: 'Crypto',
  invested: 0,
  sip: 0,
  returnPct: 0
}];
export const monthlyInvested = [{
  month: 'Jan',
  amount: 32000
}, {
  month: 'Feb',
  amount: 34000
}, {
  month: 'Mar',
  amount: 35500
}, {
  month: 'Apr',
  amount: 36000
}, {
  month: 'May',
  amount: 36500
}, {
  month: 'Jun',
  amount: 37000
}, {
  month: 'Jul',
  amount: 37500
}, {
  month: 'Aug',
  amount: 38000
}, {
  month: 'Sep',
  amount: 38500
}, {
  month: 'Oct',
  amount: 39000
}, {
  month: 'Nov',
  amount: 40000
}, {
  month: 'Dec',
  amount: 41000
}];
export const indices = [{
  name: 'NIFTY 50',
  changePct: 0.65,
  value: 22430
}, {
  name: 'SENSEX',
  changePct: 0.52,
  value: 74150
}, {
  name: 'GOLD (10g)',
  changePct: 0.3,
  value: 72540
}, {
  name: 'BITCOIN',
  changePct: -1.2,
  value: 64210
}];
export const news = [{
  id: 'n1',
  title: 'Markets steady; NIFTY edges higher',
  source: 'MockWire',
  time: '2h',
  category: 'Markets'
}, {
  id: 'n2',
  title: 'Debt funds benefit from falling yields',
  source: 'FinEdu',
  time: '5h',
  category: 'Education'
}, {
  id: 'n3',
  title: 'REITs gain traction among investors',
  source: 'BizDaily',
  time: '1d',
  category: 'Trends'
}, {
  id: 'n4',
  title: "Understanding emergency funds: A beginner's guide",
  source: 'FinEdu',
  time: '2d',
  category: 'Education'
}];
export const insights = [{
  id: 'i1',
  type: 'warning',
  title: 'Rebalance Suggestion',
  message: "Your equity allocation is slightly above ideal for 'Moderate' risk profile. Consider rebalancing."
}, {
  id: 'i2',
  type: 'info',
  title: 'Emergency Fund Progress',
  message: 'Top-up emergency fund by ₹15,000/month to reach 6 months target sooner.'
}, {
  id: 'i3',
  type: 'success',
  title: 'Goal on Track',
  message: "Your 'Travel 2026' goal is 45% complete and on schedule!"
}];