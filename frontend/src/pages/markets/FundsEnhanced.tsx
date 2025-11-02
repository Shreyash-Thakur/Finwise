import React, { useState, useEffect } from 'react';
import { SearchIcon, SlidersIcon, RefreshCwIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { EnhancedFundCard } from '../../components/funds/EnhancedFundCard';
import { FundCompareBar } from '../../components/funds/FundCompareBar';
import { LineChart } from '../../components/charts/LineChart';
import { addToWatchlist, isInWatchlist } from '../../lib/watchlist';
import { formatINR, projectedSipValue, projectedLumpsumValue, formatPercent } from '../../lib/fundHelpers';

// Updated interface to match API response
interface EnhancedFund {
  schemeCode: string;
  schemeName: string;
  fundHouse: string;
  category: string;
  schemeType: string;
  latestNav: number;
  navDate: string;
  returns: {
    oneYear: number | null;
    threeYear: number | null;
    fiveYear: number | null;
  };
  expenseRatio: number | null;
  aumCr: number | null;
  risk: string | null;
  // Legacy compatibility fields
  id: string;
  name: string;
  amc: string;
  nav: number;
  ret1Y: number;
  ret3Y: number;
  ret5Y: number;
  expense: number;
  minSip: number;
  navSeries?: number[];
  // Additional fields for compare bar compatibility
  oneY?: number;
  threeY?: number;
  fiveY?: number;
  sipMin?: number;
}
export function FundsEnhanced() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [amcSearch, setAmcSearch] = useState('');
  const [sortBy, setSortBy] = useState('ret1Y');
  const [expenseMax, setExpenseMax] = useState(2.0);
  const [aumMin, setAumMin] = useState(0);
  const [selectedFund, setSelectedFund] = useState<EnhancedFund | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<EnhancedFund[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [funds, setFunds] = useState<EnhancedFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculator states
  const [sipAmount, setSipAmount] = useState('5000');
  const [sipYears, setSipYears] = useState('5');
  const [lumpsumAmount, setLumpsumAmount] = useState('100000');
  const [lumpsumYears, setLumpsumYears] = useState('5');

  // Fetch funds data from API
  const fetchFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5001/api/market/funds');
      if (!response.ok) {
        throw new Error(`Failed to fetch funds: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch funds');
      }
      
      // Transform API data to match component interface
      const transformedFunds: EnhancedFund[] = data.funds.map((fund: any) => ({
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        fundHouse: fund.fundHouse,
        category: fund.category,
        schemeType: fund.schemeType,
        latestNav: fund.latestNav,
        navDate: fund.navDate,
        returns: fund.returns,
        expenseRatio: fund.expenseRatio,
        aumCr: fund.aumCr,
        risk: fund.risk || 'Moderate', // Default risk level
        // Legacy compatibility fields for existing UI
        id: fund.schemeCode,
        name: fund.schemeName,
        amc: fund.fundHouse,
        nav: fund.latestNav,
        ret1Y: fund.returns.oneYear || 0,
        ret3Y: fund.returns.threeYear || 0,
        ret5Y: fund.returns.fiveYear || 0,
        expense: fund.expenseRatio || 0,
        minSip: 500, // Default minimum SIP
        navSeries: [], // Will be populated when viewing details
        // Additional compatibility fields
        oneY: fund.returns.oneYear || 0,
        threeY: fund.returns.threeYear || 0,
        fiveY: fund.returns.fiveYear || 0,
        sipMin: 500
      }));
      
      setFunds(transformedFunds);
    } catch (err) {
      console.error('Error fetching funds:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch funds');
    } finally {
      setLoading(false);
    }
  };

  // Load funds on component mount
  useEffect(() => {
    fetchFunds();
  }, []);
  const categories = Array.from(new Set(funds.map(f => f.category)));
  const amcs = Array.from(new Set(funds.map(f => f.amc)));
  
  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || fund.category === categoryFilter;
    const matchesRisk = riskFilter === 'all' || fund.risk === riskFilter;
    const matchesAMC = !amcSearch || fund.amc.toLowerCase().includes(amcSearch.toLowerCase());
    const matchesExpense = fund.expense <= expenseMax;
    const matchesAUM = (fund.aumCr || 0) >= aumMin;
    return matchesSearch && matchesCategory && matchesRisk && matchesAMC && matchesExpense && matchesAUM;
  }).sort((a, b) => {
    if (sortBy === 'ret1Y') return b.ret1Y - a.ret1Y;
    if (sortBy === 'ret3Y') return b.ret3Y - a.ret3Y;
    if (sortBy === 'ret5Y') return b.ret5Y - a.ret5Y;
    if (sortBy === 'expense') return a.expense - b.expense;
    if (sortBy === 'aum') return (b.aumCr || 0) - (a.aumCr || 0);
    return 0;
  });
  const handleAddToWatchlist = (fund: EnhancedFund) => {
    addToWatchlist({
      id: fund.id,
      type: 'fund',
      symbol: fund.id,
      name: fund.name
    });
  };
  const toggleCompareSelection = (fund: EnhancedFund) => {
    setSelectedForCompare(prev => {
      const exists = prev.find(f => f.id === fund.id);
      if (exists) {
        return prev.filter(f => f.id !== fund.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 funds at a time');
        return prev;
      }
      return [...prev, fund];
    });
  };
  const handleCompare = () => {
    const ids = selectedForCompare.map(f => f.id).join(',');
    navigate(`/markets/funds/compare?ids=${ids}`);
  };
  const navChartData = selectedFund?.navSeries?.map((nav, idx) => ({
    month: `M${idx + 1}`,
    nav
  })) || [];
  const sipFV = selectedFund ? projectedSipValue(parseInt(sipAmount) || 0, parseInt(sipYears) || 0, selectedFund.ret5Y / 100) : 0;
  const lumpsumFV = selectedFund ? projectedLumpsumValue(parseInt(lumpsumAmount) || 0, parseInt(lumpsumYears) || 0, selectedFund.ret5Y / 100) : 0;
  return <PageContainer title="Mutual Funds" description="Discover and compare top-performing mutual funds">
      {/* Search and Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <Input placeholder="Search funds by name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={[{
        value: 'all',
        label: 'All Categories'
      }, ...categories.map(cat => ({
        value: cat,
        label: cat
      }))]} />
        <Select value={sortBy} onChange={e => setSortBy(e.target.value)} options={[{
        value: 'ret1Y',
        label: 'Sort by 1Y Return'
      }, {
        value: 'ret3Y',
        label: 'Sort by 3Y Return'
      }, {
        value: 'ret5Y',
        label: 'Sort by 5Y Return'
      }, {
        value: 'expense',
        label: 'Sort by Expense'
      }, {
        value: 'aum',
        label: 'Sort by AUM'
      }]} />
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} style={{
        borderColor: `rgb(var(--border))`,
        color: `rgb(var(--text))`
      }}>
          <SlidersIcon className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {showFilters && <Card className="mt-4" style={{
        backgroundColor: `rgb(var(--card))`,
        borderColor: `rgb(var(--border))`
      }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select label="Risk Level" value={riskFilter} onChange={e => setRiskFilter(e.target.value)} options={[{
            value: 'all',
            label: 'All Risk Levels'
          }, {
            value: 'Low',
            label: 'Low Risk'
          }, {
            value: 'Moderate',
            label: 'Moderate Risk'
          }, {
            value: 'High',
            label: 'High Risk'
          }]} />
              <Input label="AMC Search" placeholder="e.g., HDFC, SBI" value={amcSearch} onChange={e => setAmcSearch(e.target.value)} />
              <div>
                <label className="block text-sm font-medium mb-1" style={{
              color: `rgb(var(--text))`
            }}>
                  Max Expense Ratio: {formatPercent(expenseMax, 2)}
                </label>
                <input type="range" min="0" max="2" step="0.1" value={expenseMax} onChange={e => setExpenseMax(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{
              color: `rgb(var(--text))`
            }}>
                  Min AUM (Cr): {aumMin}
                </label>
                <input type="range" min="0" max="25000" step="1000" value={aumMin} onChange={e => setAumMin(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
          </Card>}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCwIcon className="w-6 h-6 animate-spin mr-2" />
          <span>Loading mutual funds...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
          <Button variant="ghost" size="sm" onClick={fetchFunds} className="mt-2">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="mb-4">
          <p className="text-sm" style={{
            color: `rgb(var(--text-muted))`
          }}>
            Showing {filteredFunds.length} of {funds.length} funds
          </p>
        </div>
      )}

      {/* Fund Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredFunds.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No funds match your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredFunds.map(fund => (
              <EnhancedFundCard 
                key={fund.id} 
                fund={fund as any} // Type assertion to bypass strict typing for now
                onAddToWatchlist={() => handleAddToWatchlist(fund)} 
                onViewDetails={() => setSelectedFund(fund)} 
                onToggleCompare={() => toggleCompareSelection(fund)} 
                isInWatchlist={isInWatchlist(fund.id, 'fund')} 
                isSelectedForCompare={selectedForCompare.some(f => f.id === fund.id)} 
              />
            ))
          )}
        </div>
      )}

      {/* Compare Bar */}
      <FundCompareBar 
        selectedFunds={selectedForCompare as any} // Type assertion for compatibility
        onRemove={fundId => setSelectedForCompare(prev => prev.filter(f => f.id !== fundId))} 
        onCompare={handleCompare} 
        onClear={() => setSelectedForCompare([])} 
      />

      {/* Fund Detail Modal */}
      {selectedFund && <Modal isOpen={!!selectedFund} onClose={() => setSelectedFund(null)} title={selectedFund.name} size="xl">
          <div className="space-y-6">
            {/* NAV Chart */}
            <div>
              <h3 className="font-semibold mb-3" style={{
            color: `rgb(var(--text))`
          }}>
                NAV Trend (Last 12 Months)
              </h3>
              <LineChart data={navChartData} dataKey="nav" xAxisKey="month" color="rgb(var(--chart-primary))" />
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm mb-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  Current NAV
                </p>
                <p className="text-xl font-bold" style={{
              color: `rgb(var(--text))`
            }}>
                  {formatINR(selectedFund.nav)}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  1Y Return
                </p>
                <p className="text-xl font-bold" style={{
              color: `rgb(var(--positive))`
            }}>
                  {formatPercent(selectedFund.ret1Y, 1)}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  3Y CAGR
                </p>
                <p className="text-xl font-bold" style={{
              color: `rgb(var(--positive))`
            }}>
                  {formatPercent(selectedFund.ret3Y, 1)}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  Expense Ratio
                </p>
                <p className="text-xl font-bold" style={{
              color: `rgb(var(--text))`
            }}>
                  {formatPercent(selectedFund.expense, 2)}
                </p>
              </div>
            </div>

            {/* SIP Calculator */}
            <div className="rounded-lg p-4" style={{
          backgroundColor: `rgba(var(--accent), 0.05)`,
          border: `1px solid rgba(var(--accent), 0.2)`
        }}>
              <h4 className="font-semibold mb-3" style={{
            color: `rgb(var(--text))`
          }}>
                SIP Calculator
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Monthly SIP (₹)" type="number" value={sipAmount} onChange={e => setSipAmount(e.target.value)} />
                <Input label="Tenure (years)" type="number" value={sipYears} onChange={e => setSipYears(e.target.value)} />
              </div>
              <div className="rounded-lg p-4" style={{
            backgroundColor: `rgb(var(--card))`
          }}>
                <p className="text-sm mb-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  Projected Value
                </p>
                <p className="text-2xl font-bold" style={{
              color: `rgb(var(--positive))`
            }}>
                  {formatINR(sipFV)}
                </p>
                <p className="text-xs mt-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  Based on {formatPercent(selectedFund.ret5Y, 1)} annual return
                </p>
              </div>
            </div>

            {/* Lumpsum Calculator */}
            <div className="rounded-lg p-4" style={{
          backgroundColor: `rgba(var(--chart-secondary), 0.05)`,
          border: `1px solid rgba(var(--chart-secondary), 0.2)`
        }}>
              <h4 className="font-semibold mb-3" style={{
            color: `rgb(var(--text))`
          }}>
                Lumpsum Calculator
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Investment Amount (₹)" type="number" value={lumpsumAmount} onChange={e => setLumpsumAmount(e.target.value)} />
                <Input label="Tenure (years)" type="number" value={lumpsumYears} onChange={e => setLumpsumYears(e.target.value)} />
              </div>
              <div className="rounded-lg p-4" style={{
            backgroundColor: `rgb(var(--card))`
          }}>
                <p className="text-sm mb-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  Projected Value
                </p>
                <p className="text-2xl font-bold" style={{
              color: `rgb(var(--positive))`
            }}>
                  {formatINR(lumpsumFV)}
                </p>
                <p className="text-xs mt-1" style={{
              color: `rgb(var(--text-muted))`
            }}>
                  Based on {formatPercent(selectedFund.ret5Y, 1)} annual return
                </p>
              </div>
            </div>

            <Button onClick={() => handleAddToWatchlist(selectedFund)} className="w-full">
              Add to Watchlist
            </Button>
          </div>
        </Modal>}
    </PageContainer>;
}