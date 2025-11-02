/**
 * Unit tests for fundMath.ts
 * Run with: npm test (or your test runner)
 */

import { cagr, volatility, maxDrawdown, sipBacktest, normalizeToBase100, hasEnoughHistory, NAVPoint } from './fundMath';

// Test data
const sampleSeries1: NAVPoint[] = [{
  date: '2020-01-01',
  nav: 100
}, {
  date: '2020-02-01',
  nav: 105
}, {
  date: '2020-03-01',
  nav: 110
}, {
  date: '2020-04-01',
  nav: 108
}, {
  date: '2020-05-01',
  nav: 115
}, {
  date: '2020-06-01',
  nav: 120
}, {
  date: '2020-07-01',
  nav: 118
}, {
  date: '2020-08-01',
  nav: 125
}, {
  date: '2020-09-01',
  nav: 130
}, {
  date: '2020-10-01',
  nav: 128
}, {
  date: '2020-11-01',
  nav: 135
}, {
  date: '2020-12-01',
  nav: 140
}];
const sampleSeries2: NAVPoint[] = [{
  date: '2020-01-01',
  nav: 50
}, {
  date: '2020-02-01',
  nav: 52
}, {
  date: '2020-03-01',
  nav: 48
}, {
  date: '2020-04-01',
  nav: 45
}, {
  date: '2020-05-01',
  nav: 50
}, {
  date: '2020-06-01',
  nav: 55
}];
describe('fundMath utilities', () => {
  describe('cagr', () => {
    test('calculates CAGR correctly for 1 year', () => {
      const result = cagr(sampleSeries1, 1);
      expect(result).toBeGreaterThan(30); // ~40% growth
      expect(result).toBeLessThan(50);
    });
    test('handles short history gracefully', () => {
      const result = cagr(sampleSeries2, 1);
      expect(result).toBeGreaterThan(0);
    });
    test('returns 0 for empty series', () => {
      const result = cagr([], 1);
      expect(result).toBe(0);
    });
  });
  describe('volatility', () => {
    test('calculates volatility for series', () => {
      const result = volatility(sampleSeries1);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100); // Reasonable range
    });
    test('returns 0 for insufficient data', () => {
      const result = volatility([{
        date: '2020-01-01',
        nav: 100
      }]);
      expect(result).toBe(0);
    });
  });
  describe('maxDrawdown', () => {
    test('calculates max drawdown correctly', () => {
      const result = maxDrawdown(sampleSeries2);
      expect(result.drawdown).toBeGreaterThan(0);
      expect(result.worstMonth).toBeGreaterThan(0);
    });
    test('returns 0 for monotonically increasing series', () => {
      const increasing: NAVPoint[] = [{
        date: '2020-01-01',
        nav: 100
      }, {
        date: '2020-02-01',
        nav: 110
      }, {
        date: '2020-03-01',
        nav: 120
      }];
      const result = maxDrawdown(increasing);
      expect(result.drawdown).toBe(0);
    });
  });
  describe('sipBacktest', () => {
    test('calculates SIP backtest correctly', () => {
      const result = sipBacktest(sampleSeries1, 1000);
      expect(result.invested).toBe(12000); // 12 months * 1000
      expect(result.currentValue).toBeGreaterThan(result.invested);
      expect(result.xirr).toBeGreaterThan(0);
      expect(result.units).toBeGreaterThan(0);
    });
    test('handles zero SIP amount', () => {
      const result = sipBacktest(sampleSeries1, 0);
      expect(result.invested).toBe(0);
      expect(result.currentValue).toBe(0);
    });
  });
  describe('normalizeToBase100', () => {
    test('normalizes series to base 100', () => {
      const result = normalizeToBase100(sampleSeries1);
      expect(result[0].value).toBe(100);
      expect(result[result.length - 1].value).toBe(140); // 40% growth
    });
    test('handles empty series', () => {
      const result = normalizeToBase100([]);
      expect(result).toEqual([]);
    });
  });
  describe('hasEnoughHistory', () => {
    test('validates history length correctly', () => {
      expect(hasEnoughHistory(sampleSeries1, 1)).toBe(true);
      expect(hasEnoughHistory(sampleSeries1, 2)).toBe(false);
      expect(hasEnoughHistory(sampleSeries2, 1)).toBe(false);
    });
  });
});

// Export for test runner
export {};