import React, { useState } from 'react';
import { SearchIcon, CheckSquareIcon, SquareIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { FundCard } from '../../components/markets/FundCard';
import { FundCompareBar } from '../../components/funds/FundCompareBar';
import { Modal } from '../../components/ui/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { Button } from '../../components/ui/Button';
import { topFunds, fundCategories, MutualFund } from '../../data/markets/funds';
import { addToWatchlist, isInWatchlist } from '../../lib/watchlist';
import { fmtINR, calculateSIPFV, calculateLumpsumFV } from '../../lib/marketUtils';
export function Funds() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('oneY');
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<MutualFund[]>([]);
  const [sipAmount, setSipAmount] = useState('5000');
  const [sipTenure, setSipTenure] = useState('120');
  const [lumpsumAmount, setLumpsumAmount] = useState('100000');
  const [lumpsumYears, setLumpsumYears] = useState('5');
  const filteredFunds = topFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || fund.category === categoryFilter;
    const matchesRisk = riskFilter === 'all' || fund.risk === riskFilter;
    return matchesSearch && matchesCategory && matchesRisk;
  }).sort((a, b) => {
    if (sortBy === 'oneY') return b.oneY - a.oneY;
    if (sortBy === 'threeY') return b.threeY - a.threeY;
    if (sortBy === 'fiveY') return b.fiveY - a.fiveY;
    if (sortBy === 'expense') return a.expense - b.expense;
    if (sortBy === 'aum') return b.aumCr - a.aumCr;
    return 0;
  });
  const handleAddToWatchlist = (fund: any) => {
    addToWatchlist({
      id: fund.id,
      type: 'fund',
      symbol: fund.id,
      name: fund.name
    });
  };
  const toggleCompareSelection = (fund: MutualFund) => {
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
  const sipFV = selectedFund ? calculateSIPFV(parseInt(sipAmount) || 0, parseInt(sipTenure) || 0, selectedFund.threeY) : 0;
  const lumpsumFV = selectedFund ? calculateLumpsumFV(parseInt(lumpsumAmount) || 0, parseInt(lumpsumYears) || 0, selectedFund.threeY) : 0;
  const navChartData = selectedFund?.navHistory?.map((nav: number, idx: number) => ({
    month: `M${idx + 1}`,
    nav
  })) || [];
  return <PageContainer title="Mutual Funds" description="Top performing mutual funds in India">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Input placeholder="Search funds..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={[{
        value: 'all',
        label: 'All Categories'
      }, ...fundCategories.map(cat => ({
        value: cat,
        label: cat
      }))]} />
        <Select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} options={[{
        value: 'all',
        label: 'All Risk Levels'
      }, {
        value: 'High',
        label: 'High Risk'
      }, {
        value: 'Moderate',
        label: 'Moderate Risk'
      }, {
        value: 'Low',
        label: 'Low Risk'
      }]} />
        <Select value={sortBy} onChange={e => setSortBy(e.target.value)} options={[{
        value: 'oneY',
        label: 'Sort by 1Y Return'
      }, {
        value: 'threeY',
        label: 'Sort by 3Y Return'
      }, {
        value: 'fiveY',
        label: 'Sort by 5Y Return'
      }, {
        value: 'expense',
        label: 'Sort by Expense'
      }, {
        value: 'aum',
        label: 'Sort by AUM'
      }]} />
        <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
          {filteredFunds.length} funds
        </div>
      </div>

      {/* Fund Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {filteredFunds.map(fund => {
        const isSelected = selectedForCompare.some(f => f.id === fund.id);
        return <div key={fund.id} className="relative">
              <button onClick={() => toggleCompareSelection(fund)} className="absolute top-2 left-2 z-10 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow" title={isSelected ? 'Remove from compare' : 'Add to compare'}>
                {isSelected ? <CheckSquareIcon className="w-5 h-5 text-primary-600" /> : <SquareIcon className="w-5 h-5 text-slate-400" />}
              </button>
              <FundCard fund={fund} onAddToWatchlist={() => handleAddToWatchlist(fund)} onViewDetails={() => setSelectedFund(fund)} isInWatchlist={isInWatchlist(fund.id, 'fund')} />
            </div>;
      })}
      </div>

      {/* Compare Bar */}
      <FundCompareBar selectedFunds={selectedForCompare} onRemove={fundId => setSelectedForCompare(prev => prev.filter(f => f.id !== fundId))} onCompare={handleCompare} onClear={() => setSelectedForCompare([])} />

      {/* Fund Detail Modal */}
      {selectedFund && <Modal isOpen={!!selectedFund} onClose={() => setSelectedFund(null)} title={selectedFund.name} size="xl">
          <div className="space-y-6">
            {/* NAV Chart */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                NAV Trend (Last 12 Months)
              </h3>
              <LineChart data={navChartData} dataKey="nav" xAxisKey="month" color="#2563EB" />
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Current NAV
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {fmtINR(selectedFund.nav)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  1Y Return
                </p>
                <p className="text-xl font-bold text-success-600">
                  {selectedFund.oneY}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  3Y Return
                </p>
                <p className="text-xl font-bold text-success-600">
                  {selectedFund.threeY}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Expense Ratio
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedFund.expense}%
                </p>
              </div>
            </div>

            {/* SIP Calculator */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                SIP Calculator
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Monthly SIP (₹)" type="number" value={sipAmount} onChange={e => setSipAmount(e.target.value)} />
                <Input label="Tenure (months)" type="number" value={sipTenure} onChange={e => setSipTenure(e.target.value)} />
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Projected Value
                </p>
                <p className="text-2xl font-bold text-success-600">
                  {fmtINR(sipFV)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Based on {selectedFund.threeY}% annual return
                </p>
              </div>
            </div>

            {/* Lumpsum Calculator */}
            <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Lumpsum Calculator
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Investment Amount (₹)" type="number" value={lumpsumAmount} onChange={e => setLumpsumAmount(e.target.value)} />
                <Input label="Tenure (years)" type="number" value={lumpsumYears} onChange={e => setLumpsumYears(e.target.value)} />
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Projected Value
                </p>
                <p className="text-2xl font-bold text-success-600">
                  {fmtINR(lumpsumFV)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Based on {selectedFund.threeY}% annual return
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