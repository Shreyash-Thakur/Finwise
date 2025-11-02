import React, { useEffect, useMemo, useState } from 'react';
import { XIcon, AlertCircleIcon } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ASSET_OPTIONS, SERIES, STATS, distinct, isFiniteArray, normalize, alignLength, monthsForRange, toPct, toINR, type AssetKey, type StatsMap } from '../../lib/compareHelpers';
type Period = '1Y' | '3Y' | '5Y' | '10Y';
interface CompareResult {
  labels: string[];
  lines: {
    key: AssetKey;
    values: number[];
  }[];
  stats: StatsMap;
}
export function Compare() {
  const [sel1, setSel1] = useState<AssetKey | ''>('');
  const [sel2, setSel2] = useState<AssetKey | ''>('');
  const [sel3, setSel3] = useState<AssetKey | ''>('');
  const [period, setPeriod] = useState<Period>('3Y');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');
  const [result, setResult] = useState<CompareResult | null>(null);
  const selected = useMemo(() => [sel1, sel2, sel3].filter(Boolean) as AssetKey[], [sel1, sel2, sel3]);
  // Get available options for each dropdown (excluding already selected)
  const getAvailableOptions = (currentValue: AssetKey | '') => {
    return ASSET_OPTIONS.filter(opt => opt.key === currentValue || !selected.includes(opt.key));
  };
  const handleRemove = (key: AssetKey) => {
    if (sel1 === key) setSel1('');
    if (sel2 === key) setSel2('');
    if (sel3 === key) setSel3('');
    setResult(null);
    setErr('');
  };
  const onCompare = async () => {
    setErr('');
    setResult(null);
    const uniq = distinct(selected);
    if (uniq.length < 2) {
      setErr('Select at least 2 distinct assets.');
      return;
    }
    try {
      setLoading(true);
      // Get series (fallback to local SERIES)
      const months = monthsForRange(period);
      const rawSeries = uniq.map(k => {
        const s = SERIES[k];
        if (!isFiniteArray(s)) {
          throw new Error(`No series data available for ${k}`);
        }
        const clip = s.slice(-months); // last N months
        const norm = normalize(clip);
        if (!norm.length) {
          throw new Error(`Invalid data for ${k}`);
        }
        return norm;
      });
      // Align all to same length
      const aligned = alignLength(rawSeries);
      if (!aligned.length || !aligned[0].length) {
        throw new Error('Unable to align data series');
      }
      const L = aligned[0].length;
      const labels = Array.from({
        length: L
      }, (_, i) => `M${i + 1}`);
      const lines = aligned.map((values, i) => ({
        key: uniq[i],
        values
      }));
      // Stats (fallback)
      const pageStats: StatsMap = {};
      uniq.forEach(k => {
        pageStats[k] = STATS[k] ?? {};
      });
      setResult({
        labels,
        lines,
        stats: pageStats
      });
    } catch (e: any) {
      console.error('Compare error:', e);
      setErr(e?.message ?? 'Something went wrong while comparing assets.');
    } finally {
      setLoading(false);
    }
  };
  // Auto-compare when period changes and we have valid selections
  useEffect(() => {
    if (selected.length >= 2) {
      onCompare();
    }
  }, [period]);
  // Get colors from CSS variables
  const getChartColor = (index: number) => {
    const colors = ['--accent', '--chart-secondary', '--chart-tertiary'];
    const varName = colors[index] || colors[0];
    return `rgb(var(${varName}))`;
  };
  const canCompare = selected.length >= 2;
  const showResults = result && result.lines.length >= 2;
  // Prepare chart data
  const chartData = showResults ? result.labels.map((label, i) => {
    const point: any = {
      month: label
    };
    result.lines.forEach(line => {
      point[line.key] = line.values[i] ?? null;
    });
    return point;
  }) : [];
  return <ErrorBoundary>
      <PageContainer title="Compare Assets" description="Compare indices, crypto, commodities, and top mutual funds">
        {/* Asset Selection Card */}
        <Card className="mb-6" style={{
        backgroundColor: 'rgb(var(--card))',
        borderColor: 'rgb(var(--border))'
      }}>
          <h3 className="text-lg font-semibold mb-4" style={{
          color: 'rgb(var(--text))'
        }}>
            Select Assets (Max 3)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Asset 1 - Required */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{
              color: 'rgb(var(--text))'
            }}>
                Asset 1 (required)
              </label>
              <Select value={sel1} onChange={e => {
              setSel1(e.target.value as AssetKey | '');
              setResult(null);
              setErr('');
            }} options={[{
              value: '',
              label: 'Select first asset…'
            }, ...getAvailableOptions(sel1).map(opt => ({
              value: opt.key,
              label: opt.label
            }))]} />
            </div>

            {/* Asset 2 - Required */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{
              color: 'rgb(var(--text))'
            }}>
                Asset 2 (required)
              </label>
              <Select value={sel2} onChange={e => {
              setSel2(e.target.value as AssetKey | '');
              setResult(null);
              setErr('');
            }} disabled={!sel1} options={[{
              value: '',
              label: 'Select second asset…'
            }, ...getAvailableOptions(sel2).map(opt => ({
              value: opt.key,
              label: opt.label
            }))]} />
            </div>

            {/* Asset 3 - Optional */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{
              color: 'rgb(var(--text))'
            }}>
                Asset 3 (optional)
              </label>
              <Select value={sel3} onChange={e => {
              setSel3(e.target.value as AssetKey | '');
              setResult(null);
              setErr('');
            }} disabled={!sel1 || !sel2} options={[{
              value: '',
              label: 'Select third asset (optional)…'
            }, ...getAvailableOptions(sel3).map(opt => ({
              value: opt.key,
              label: opt.label
            }))]} />
            </div>
          </div>

          {/* Selected Assets Chips */}
          {selected.length > 0 && <div className="flex flex-wrap gap-2 mb-4">
              {selected.map((key, idx) => {
            const asset = ASSET_OPTIONS.find(a => a.key === key);
            return <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              backgroundColor: `rgba(var(--accent), 0.1)`,
              color: getChartColor(idx)
            }}>
                    <span className="text-sm font-medium">{asset?.label}</span>
                    <button onClick={() => handleRemove(key)} className="hover:opacity-70" aria-label={`Remove ${asset?.label}`}>
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>;
          })}
            </div>}

          {/* Compare Button */}
          <Button onClick={onCompare} disabled={!canCompare || loading} className="w-full">
            {loading ? 'Comparing...' : 'Compare Assets'}
          </Button>
        </Card>

        {/* Error Banner */}
        {err && <Card className="mb-6 p-4" style={{
        backgroundColor: 'rgba(var(--negative), 0.1)',
        borderColor: 'rgb(var(--negative))'
      }}>
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{
            color: 'rgb(var(--negative))'
          }} />
              <div className="flex-1">
                <p className="font-medium mb-2" style={{
              color: 'rgb(var(--negative))'
            }}>
                  {err}
                </p>
                <Button onClick={onCompare} size="sm" variant="ghost" style={{
              borderColor: 'rgb(var(--negative))',
              color: 'rgb(var(--negative))'
            }}>
                  Retry
                </Button>
              </div>
            </div>
          </Card>}

        {/* Results Area */}
        {!showResults && !err && !loading && <Card className="text-center py-12" style={{
        backgroundColor: 'rgb(var(--card))',
        borderColor: 'rgb(var(--border))'
      }}>
            <p style={{
          color: 'rgb(var(--muted))'
        }}>
              {canCompare ? 'Click "Compare Assets" to see the comparison.' : 'Select at least 2 assets to compare.'}
            </p>
          </Card>}

        {showResults && <>
            {/* Period Selector */}
            <div className="flex gap-2 mb-6">
              {(['1Y', '3Y', '5Y', '10Y'] as Period[]).map(p => <button key={p} onClick={() => setPeriod(p)} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50" style={{
            backgroundColor: period === p ? 'rgb(var(--accent))' : 'rgba(var(--muted), 0.2)',
            color: period === p ? 'white' : 'rgb(var(--text))',
            borderWidth: '1px',
            borderColor: period === p ? 'transparent' : 'rgb(var(--border))'
          }}>
                  {p}
                </button>)}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* CAGR */}
              <Card style={{
            backgroundColor: 'rgb(var(--card))',
            borderColor: 'rgb(var(--border))'
          }}>
                <h4 className="text-sm font-medium mb-3" style={{
              color: 'rgb(var(--muted))'
            }}>
                  CAGR ({period})
                </h4>
                <div className="space-y-2">
                  {result.lines.map((line, idx) => {
                const asset = ASSET_OPTIONS.find(a => a.key === line.key);
                const stats = result.stats[line.key];
                return <div key={line.key} className="flex items-center justify-between">
                        <span className="text-xs truncate mr-2" style={{
                    color: 'rgb(var(--muted))'
                  }}>
                          {asset?.label.split(' ')[0]}
                        </span>
                        <span className="text-sm font-semibold" style={{
                    color: getChartColor(idx)
                  }}>
                          {toPct(stats?.cagr)}
                        </span>
                      </div>;
              })}
                </div>
              </Card>

              {/* Volatility */}
              <Card style={{
            backgroundColor: 'rgb(var(--card))',
            borderColor: 'rgb(var(--border))'
          }}>
                <h4 className="text-sm font-medium mb-3" style={{
              color: 'rgb(var(--muted))'
            }}>
                  Volatility
                </h4>
                <div className="space-y-2">
                  {result.lines.map((line, idx) => {
                const asset = ASSET_OPTIONS.find(a => a.key === line.key);
                const stats = result.stats[line.key];
                return <div key={line.key} className="flex items-center justify-between">
                        <span className="text-xs truncate mr-2" style={{
                    color: 'rgb(var(--muted))'
                  }}>
                          {asset?.label.split(' ')[0]}
                        </span>
                        <span className="text-sm font-semibold" style={{
                    color: getChartColor(idx)
                  }}>
                          {toPct(stats?.vol)}
                        </span>
                      </div>;
              })}
                </div>
              </Card>

              {/* Max Drawdown */}
              <Card style={{
            backgroundColor: 'rgb(var(--card))',
            borderColor: 'rgb(var(--border))'
          }}>
                <h4 className="text-sm font-medium mb-3" style={{
              color: 'rgb(var(--muted))'
            }}>
                  Max Drawdown
                </h4>
                <div className="space-y-2">
                  {result.lines.map((line, idx) => {
                const asset = ASSET_OPTIONS.find(a => a.key === line.key);
                const stats = result.stats[line.key];
                return <div key={line.key} className="flex items-center justify-between">
                        <span className="text-xs truncate mr-2" style={{
                    color: 'rgb(var(--muted))'
                  }}>
                          {asset?.label.split(' ')[0]}
                        </span>
                        <span className="text-sm font-semibold" style={{
                    color: 'rgb(var(--negative))'
                  }}>
                          -{toPct(stats?.mdd)}
                        </span>
                      </div>;
              })}
                </div>
              </Card>

              {/* Expense / AUM */}
              <Card style={{
            backgroundColor: 'rgb(var(--card))',
            borderColor: 'rgb(var(--border))'
          }}>
                <h4 className="text-sm font-medium mb-3" style={{
              color: 'rgb(var(--muted))'
            }}>
                  Expense / AUM
                </h4>
                <div className="space-y-2">
                  {result.lines.map((line, idx) => {
                const asset = ASSET_OPTIONS.find(a => a.key === line.key);
                const stats = result.stats[line.key];
                const displayValue = stats?.expense ? toPct(stats.expense) : stats?.aumCr ? toINR(stats.aumCr) : '—';
                return <div key={line.key} className="flex items-center justify-between">
                        <span className="text-xs truncate mr-2" style={{
                    color: 'rgb(var(--muted))'
                  }}>
                          {asset?.label.split(' ')[0]}
                        </span>
                        <span className="text-sm font-semibold" style={{
                    color: getChartColor(idx)
                  }}>
                          {displayValue}
                        </span>
                      </div>;
              })}
                </div>
              </Card>
            </div>

            {/* Normalized Chart */}
            <Card style={{
          backgroundColor: 'rgb(var(--card))',
          borderColor: 'rgb(var(--border))'
        }}>
              <h3 className="text-lg font-semibold mb-4" style={{
            color: 'rgb(var(--text))'
          }}>
                Normalized Performance (Base 100)
              </h3>
              {chartData.length > 0 ? <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis dataKey="month" stroke="rgb(var(--muted))" tick={{
                fill: 'rgb(var(--muted))'
              }} />
                    <YAxis stroke="rgb(var(--muted))" tick={{
                fill: 'rgb(var(--muted))'
              }} />
                    <Tooltip contentStyle={{
                backgroundColor: 'rgb(var(--card))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
                color: 'rgb(var(--text))'
              }} />
                    <Legend />
                    {result.lines.map((line, idx) => {
                const asset = ASSET_OPTIONS.find(a => a.key === line.key);
                return <Line key={line.key} type="monotone" dataKey={line.key} name={asset?.label} stroke={getChartColor(idx)} strokeWidth={2} dot={false} />;
              })}
                  </LineChart>
                </ResponsiveContainer> : <p className="text-center py-8" style={{
            color: 'rgb(var(--muted))'
          }}>
                  No chart data available
                </p>}
            </Card>
          </>}
      </PageContainer>
    </ErrorBoundary>;
}