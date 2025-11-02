import React, { useState, createElement } from 'react';
import { DownloadIcon, PrinterIcon } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Table } from '../components/ui/Table';
import { DonutChart } from '../components/charts/DonutChart';
import { LineChart } from '../components/charts/LineChart';
import { holdings, monthlyInvested } from '../data/seed';
import { totalInvested, totalSIP } from '../data/derived';
import { fmtINR, pct } from '../utils/formatters';
export function Investments() {
  const [stressScenario, setStressScenario] = useState<string | null>(null);
  const portfolioData = holdings.filter(h => h.invested > 0).map(h => ({
    name: h.asset,
    value: h.invested
  }));
  const applyStressTest = (scenario: string) => {
    setStressScenario(scenario);
  };
  const getStressedValue = () => {
    if (!stressScenario) return totalInvested;
    let stressedTotal = 0;
    holdings.forEach(h => {
      let value = h.invested;
      if (stressScenario === 'equity-10' && h.asset === 'Equity') {
        value *= 0.9;
      } else if (stressScenario === 'inflation+1') {
        // Reduce real value by ~3%
        value *= 0.97;
      } else if (stressScenario === 'rates-up') {
        if (h.asset === 'Debt') value *= 0.92;
        if (h.asset === 'Equity') value *= 0.95;
      }
      stressedTotal += value;
    });
    return Math.round(stressedTotal);
  };
  const stressedValue = getStressedValue();
  const stressDelta = stressedValue - totalInvested;
  const columns = [{
    key: 'asset',
    label: 'Asset Class',
    align: 'left' as const
  }, {
    key: 'invested',
    label: 'Invested',
    align: 'right' as const,
    render: (val: number) => fmtINR(val)
  }, {
    key: 'sip',
    label: 'SIP/Month',
    align: 'right' as const,
    render: (val: number) => fmtINR(val)
  }, {
    key: 'returnPct',
    label: 'Return %',
    align: 'right' as const,
    render: (val: number) => <span className={val > 0 ? 'text-success-600' : 'text-slate-600'}>
          {pct(val)}
        </span>
  }];
  const exportCSV = () => {
    const csv = [['Asset', 'Invested', 'SIP/Month', 'Return %'], ...holdings.map(h => [h.asset, h.invested, h.sip, h.returnPct])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investments.csv';
    a.click();
  };
  return <PageContainer title="Investments" description="Track your portfolio and investment performance">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Portfolio Distribution
          </h2>
          <DonutChart data={portfolioData} />
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">Total Invested</p>
            <p className="text-2xl font-bold text-slate-900">
              {fmtINR(totalInvested)}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Monthly Contributions
          </h2>
          <LineChart data={monthlyInvested} dataKey="amount" xAxisKey="month" color="#2563EB" />
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">Current Monthly SIP</p>
            <p className="text-2xl font-bold text-slate-900">
              {fmtINR(totalSIP)}
            </p>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Holdings Breakdown
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={exportCSV}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <Table columns={columns} data={holdings} footer={<tr className="border-t-2 border-slate-300 font-semibold">
              <td className="px-4 py-3 text-sm text-slate-900">Total</td>
              <td className="px-4 py-3 text-sm text-slate-900 text-right">
                {fmtINR(totalInvested)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-900 text-right">
                {fmtINR(totalSIP)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-900 text-right">—</td>
            </tr>} />
      </Card>

      {/* Stress Tests */}
      <Card>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Stress Test Scenarios
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          See how your portfolio would perform under different market conditions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button variant={stressScenario === 'equity-10' ? 'primary' : 'ghost'} onClick={() => applyStressTest('equity-10')} className="border border-slate-300">
            Equity -10%
          </Button>
          <Button variant={stressScenario === 'inflation+1' ? 'primary' : 'ghost'} onClick={() => applyStressTest('inflation+1')} className="border border-slate-300">
            Inflation +1%
          </Button>
          <Button variant={stressScenario === 'rates-up' ? 'primary' : 'ghost'} onClick={() => applyStressTest('rates-up')} className="border border-slate-300">
            Interest Rates ↑
          </Button>
        </div>

        {stressScenario && <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Current Value</p>
                <p className="text-2xl font-bold text-slate-900">
                  {fmtINR(totalInvested)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Simulated Value</p>
                <p className="text-2xl font-bold text-danger-600">
                  {fmtINR(stressedValue)}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">Impact</p>
              <p className={`text-xl font-bold ${stressDelta < 0 ? 'text-danger-600' : 'text-success-600'}`}>
                {stressDelta < 0 ? '' : '+'}
                {fmtINR(stressDelta)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStressScenario(null)} className="mt-4">
              Clear Scenario
            </Button>
          </div>}
      </Card>
    </PageContainer>;
}