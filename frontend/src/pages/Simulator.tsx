import React, { useState } from 'react';
import { PlayIcon, CheckIcon } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DonutChart } from '../components/charts/DonutChart';
import { plan as seedPlan, goals } from '../data/seed';
import { fmtINR } from '../utils/formatters';
export function Simulator() {
  const [inputs, setInputs] = useState({
    income: seedPlan.monthlyIncome,
    fixedExpenses: seedPlan.splitMonthly.needs,
    debt: seedPlan.splitMonthly.debt,
    riskProfile: 'Moderate'
  });
  const [simulated, setSimulated] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const riskAllocations: any = {
    Low: {
      equity: 40,
      debt: 45,
      gold: 12,
      reit: 3,
      crypto: 0
    },
    Moderate: {
      equity: 60,
      debt: 30,
      gold: 8,
      reit: 2,
      crypto: 0
    },
    High: {
      equity: 75,
      debt: 15,
      gold: 8,
      reit: 2,
      crypto: 0
    }
  };
  const runSimulation = () => {
    const emergency = inputs.riskProfile === 'Low' ? 12000 : inputs.riskProfile === 'Moderate' ? 8000 : 6000;
    const investments = inputs.income - (inputs.fixedExpenses + emergency + inputs.debt);
    const allocation = riskAllocations[inputs.riskProfile];
    const allocationArray = Object.entries(allocation).filter(([_, value]) => value > 0).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number
    }));
    setSimulated({
      needs: inputs.fixedExpenses,
      emergency,
      debt: inputs.debt,
      investments,
      allocation: allocationArray,
      allocationPct: allocation
    });
  };
  const applyScenario = (type: string) => {
    if (type === 'income+10') {
      setInputs({
        ...inputs,
        income: Math.round(inputs.income * 1.1)
      });
    } else if (type === 'income-10') {
      setInputs({
        ...inputs,
        income: Math.round(inputs.income * 0.9)
      });
    } else if (type === 'risk-high') {
      setInputs({
        ...inputs,
        riskProfile: 'High'
      });
    }
  };
  const applyPlan = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  return <PageContainer title="Financial Simulator" description="Run what-if scenarios to see how changes affect your plan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Simulation Inputs
            </h2>

            <div className="space-y-4">
              <Input label="Monthly Income (₹)" type="number" value={inputs.income} onChange={e => setInputs({
              ...inputs,
              income: parseInt(e.target.value) || 0
            })} />

              <Input label="Fixed Expenses (₹)" type="number" value={inputs.fixedExpenses} onChange={e => setInputs({
              ...inputs,
              fixedExpenses: parseInt(e.target.value) || 0
            })} />

              <Input label="Debt EMI (₹)" type="number" value={inputs.debt} onChange={e => setInputs({
              ...inputs,
              debt: parseInt(e.target.value) || 0
            })} />

              <Select label="Risk Profile" value={inputs.riskProfile} onChange={e => setInputs({
              ...inputs,
              riskProfile: e.target.value
            })} options={[{
              value: 'Low',
              label: 'Low (Conservative)'
            }, {
              value: 'Moderate',
              label: 'Moderate (Balanced)'
            }, {
              value: 'High',
              label: 'High (Aggressive)'
            }]} />

              <Button onClick={runSimulation} className="w-full">
                <PlayIcon className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </Card>

          {/* Quick Scenarios */}
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3">
              Quick Scenarios
            </h3>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" onClick={() => applyScenario('income+10')} className="w-full justify-start border border-slate-300">
                Income +10%
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyScenario('income-10')} className="w-full justify-start border border-slate-300">
                Income -10%
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyScenario('risk-high')} className="w-full justify-start border border-slate-300">
                Switch to High Risk
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {simulated ? <>
              <Card>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Simulated Plan
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Needs</p>
                      <p className="text-xl font-bold text-slate-900">
                        {fmtINR(simulated.needs)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Emergency</p>
                      <p className="text-xl font-bold text-warning-600">
                        {fmtINR(simulated.emergency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Debt</p>
                      <p className="text-xl font-bold text-danger-600">
                        {fmtINR(simulated.debt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Investments</p>
                      <p className="text-xl font-bold text-success-600">
                        {fmtINR(simulated.investments)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">
                      Total Allocated
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {fmtINR(simulated.needs + simulated.emergency + simulated.debt + simulated.investments)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Asset Allocation
                </h3>
                <DonutChart data={simulated.allocation} />
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {simulated.allocation.map((item: any, idx: number) => <div key={idx} className="flex items-center justify-between">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-medium text-slate-900">
                        {item.value}%
                      </span>
                    </div>)}
                </div>
              </Card>

              <Card className="bg-primary-50 border-primary-200">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Impact Analysis
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  With this plan, your "Home Down Payment" goal could be reached
                  approximately
                  <span className="font-semibold"> 4 months earlier</span> due
                  to increased investment allocation.
                </p>

                <Button onClick={applyPlan} className="w-full">
                  {showSuccess ? <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Applied Successfully!
                    </> : 'Apply This Plan'}
                </Button>
              </Card>
            </> : <Card className="text-center py-12">
              <p className="text-slate-600 mb-2">No simulation run yet</p>
              <p className="text-sm text-slate-500">
                Adjust the inputs and click "Run Simulation" to see results
              </p>
            </Card>}
        </div>
      </div>
    </PageContainer>;
}