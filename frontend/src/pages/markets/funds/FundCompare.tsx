import React, { useEffect, useState, createElement } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShareIcon, DownloadIcon } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { LineChart } from '../../../components/charts/LineChart';
import { topFunds } from '../../../data/markets/funds';
import { cagr, volatility, maxDrawdown, sipBacktest, normalizeToBase100, hasEnoughHistory, rollingReturns } from '../../../lib/fundMath';
import { fmtINR, pctAbs, abbr } from '../../../lib/marketUtils';
import { useThemeColors } from '../../../hooks/useThemeColors';
type Period = '1Y' | '3Y' | '5Y' | '10Y';
export function FundCompare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const themeColors = useThemeColors();
  const [period, setPeriod] = useState<Period>('3Y');
  const [sipAmount, setSipAmount] = useState('2000');
  const [sipYears, setSipYears] = useState('3');
  // Get fund IDs from URL
  const fundIds = searchParams.get('ids')?.split(',') || [];
  const funds = fundIds.map(id => topFunds.find(f => f.id === id)).filter(Boolean) as any[];
  useEffect(() => {
    if (funds.length === 0) {
      navigate('/markets/funds');
    }
  }, [funds.length, navigate]);
  const periodYears: Record<Period, number> = {
    '1Y': 1,
    '3Y': 3,
    '5Y': 5,
    '10Y': 10
  };
  const currentYears = periodYears[period];
  // Calculate metrics for each fund
  const metrics = funds.map(fund => {
    const navSeries = fund.navSeries || [];
    const hasHistory = hasEnoughHistory(navSeries, currentYears);
    if (!hasHistory) {
      return {
        fundId: fund.id,
        cagr: 0,
        volatility: 0,
        maxDrawdown: 0,
        expense: fund.expense,
        aum: fund.aumCr,
        hasHistory: false
      };
    }
    // Get subset of NAV series for the period
    const monthsNeeded = currentYears * 12;
    const periodSeries = navSeries.slice(-monthsNeeded);
    return {
      fundId: fund.id,
      cagr: cagr(periodSeries, currentYears),
      volatility: volatility(periodSeries),
      maxDrawdown: maxDrawdown(periodSeries).drawdown,
      expense: fund.expense,
      aum: fund.aumCr,
      hasHistory: true
    };
  });
  // Normalized growth chart data
  const normalizedData = funds.map(fund => {
    const navSeries = fund.navSeries || [];
    const monthsNeeded = currentYears * 12;
    const periodSeries = navSeries.slice(-monthsNeeded);
    return {
      name: fund.name,
      data: normalizeToBase100(periodSeries)
    };
  });
  // Prepare chart data
  const chartData = normalizedData[0]?.data.map((point, idx) => {
    const dataPoint: any = {
      date: point.date
    };
    normalizedData.forEach((fund, fundIdx) => {
      dataPoint[`fund${fundIdx}`] = fund.data[idx]?.value || 0;
    });
    return dataPoint;
  }) || [];
  // SIP Backtest
  const sipResults = funds.map(fund => {
    const navSeries = fund.navSeries || [];
    const monthsNeeded = parseInt(sipYears) * 12;
    const periodSeries = navSeries.slice(-Math.min(monthsNeeded, navSeries.length));
    return sipBacktest(periodSeries, parseInt(sipAmount) || 0);
  });
  // Export CSV
  const exportCSV = () => {
    const headers = ['Metric', ...funds.map(f => f.name)];
    const rows = [['CAGR (%)', ...metrics.map(m => m.cagr.toFixed(2))], ['Volatility (%)', ...metrics.map(m => m.volatility.toFixed(2))], ['Max Drawdown (%)', ...metrics.map(m => m.maxDrawdown.toFixed(2))], ['Expense Ratio (%)', ...metrics.map(m => m.expense.toFixed(2))], ['AUM (Cr)', ...metrics.map(m => m.aum.toFixed(0))]];
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fund-comparison-${period}.csv`;
    a.click();
  };
  // Share link
  const shareLink = () => {
    const url = `${window.location.origin}/markets/funds/compare?ids=${fundIds.join(',')}&period=${period}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };
  const getBestValue = (values: number[], higher: boolean = true) => {
    if (higher) return Math.max(...values);
    return Math.min(...values);
  };
  return <PageContainer title="Fund Comparison" description={`Comparing ${funds.length} mutual funds`}>
      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['1Y', '3Y', '5Y', '10Y'] as Period[]).map(p => {
          const years = periodYears[p];
          const allHaveHistory = funds.every(f => hasEnoughHistory(f.navSeries || [], years));
          return <button key={p} onClick={() => allHaveHistory && setPeriod(p)} disabled={!allHaveHistory} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-primary-600 text-white' : allHaveHistory ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`} title={!allHaveHistory ? 'Not enough history' : ''}>
                {p}
              </button>;
        })}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={shareLink}>
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={exportCSV}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* CAGR */}
        <Card>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            CAGR
          </h3>
          <div className="space-y-2">
            {funds.map((fund, idx) => {
            const metric = metrics[idx];
            const isBest = metric.hasHistory && metric.cagr === getBestValue(metrics.filter(m => m.hasHistory).map(m => m.cagr));
            return <div key={fund.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {fund.name.split(' ')[0]}
                  </span>
                  <span className={`text-sm font-semibold ${isBest ? 'text-success-600' : 'text-slate-900 dark:text-slate-100'}`}>
                    {metric.hasHistory ? pctAbs(metric.cagr) : 'N/A'}
                  </span>
                </div>;
          })}
          </div>
        </Card>

        {/* Volatility */}
        <Card>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            Volatility
          </h3>
          <div className="space-y-2">
            {funds.map((fund, idx) => {
            const metric = metrics[idx];
            const isBest = metric.hasHistory && metric.volatility === getBestValue(metrics.filter(m => m.hasHistory).map(m => m.volatility), false);
            return <div key={fund.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {fund.name.split(' ')[0]}
                  </span>
                  <span className={`text-sm font-semibold ${isBest ? 'text-success-600' : 'text-slate-900 dark:text-slate-100'}`}>
                    {metric.hasHistory ? pctAbs(metric.volatility) : 'N/A'}
                  </span>
                </div>;
          })}
          </div>
        </Card>

        {/* Max Drawdown */}
        <Card>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            Max Drawdown
          </h3>
          <div className="space-y-2">
            {funds.map((fund, idx) => {
            const metric = metrics[idx];
            const isBest = metric.hasHistory && metric.maxDrawdown === getBestValue(metrics.filter(m => m.hasHistory).map(m => m.maxDrawdown), false);
            return <div key={fund.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {fund.name.split(' ')[0]}
                  </span>
                  <span className={`text-sm font-semibold ${isBest ? 'text-success-600' : 'text-danger-600'}`}>
                    {metric.hasHistory ? `-${pctAbs(metric.maxDrawdown)}` : 'N/A'}
                  </span>
                </div>;
          })}
          </div>
        </Card>

        {/* Expense Ratio */}
        <Card>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            Expense %
          </h3>
          <div className="space-y-2">
            {funds.map((fund, idx) => {
            const metric = metrics[idx];
            const isBest = metric.expense === getBestValue(metrics.map(m => m.expense), false);
            return <div key={fund.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {fund.name.split(' ')[0]}
                  </span>
                  <span className={`text-sm font-semibold ${isBest ? 'text-success-600' : 'text-slate-900 dark:text-slate-100'}`}>
                    {pctAbs(metric.expense)}
                  </span>
                </div>;
          })}
          </div>
        </Card>

        {/* AUM */}
        <Card>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            AUM
          </h3>
          <div className="space-y-2">
            {funds.map((fund, idx) => {
            const metric = metrics[idx];
            return <div key={fund.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {fund.name.split(' ')[0]}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {abbr(metric.aum * 10000000)}
                  </span>
                </div>;
          })}
          </div>
        </Card>
      </div>

      {/* Normalized Growth Chart */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Normalized Growth (Base 100)
        </h3>
        {chartData.length > 0 ? <LineChart data={chartData} dataKey="fund0" xAxisKey="date" color={themeColors.primary} /> : <p className="text-slate-500 text-center py-8">
            No data available for selected period
          </p>}
      </Card>

      {/* SIP Backtest */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          SIP Backtest
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input label="Monthly SIP (₹)" type="number" value={sipAmount} onChange={e => setSipAmount(e.target.value)} />
          <Input label="Years" type="number" value={sipYears} onChange={e => setSipYears(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Fund
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Invested
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Current Value
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                  XIRR
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Gain/Loss
                </th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund, idx) => {
              const result = sipResults[idx];
              const gain = result.currentValue - result.invested;
              const gainPct = result.invested > 0 ? gain / result.invested * 100 : 0;
              return <tr key={fund.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                      {fund.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100 text-right">
                      {fmtINR(result.invested)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 text-right">
                      {fmtINR(result.currentValue)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100 text-right">
                      {pctAbs(result.xirr)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right ${gain >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {fmtINR(gain)} ({gainPct >= 0 ? '+' : ''}
                      {gainPct.toFixed(1)}%)
                    </td>
                  </tr>;
            })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>;
}