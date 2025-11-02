import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StockCard } from '../../components/markets/StockCard';
import { Badge } from '../../components/ui/Badge';
import { stocksUS } from '../../data/markets/stocksUS';
import { addToWatchlist, isInWatchlist } from '../../lib/watchlist';
export function StocksUS() {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('mcap');
  const sectors = Array.from(new Set(stocksUS.map(s => s.sector)));
  const filteredStocks = stocksUS.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(search.toLowerCase()) || stock.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === 'all' || stock.sector === sectorFilter;
    return matchesSearch && matchesSector;
  }).sort((a, b) => {
    if (sortBy === 'mcap') return b.mcapBn - a.mcapBn;
    if (sortBy === 'ch1d') return b.ch1d - a.ch1d;
    if (sortBy === 'pe') return a.pe - b.pe;
    return 0;
  });
  const handleAddToWatchlist = (stock: any) => {
    addToWatchlist({
      id: stock.symbol,
      type: 'stock-us',
      symbol: stock.symbol,
      name: stock.name
    });
  };
  return <PageContainer title="US Stocks" description="Track top US stocks">
      <div className="mb-4">
        <Badge variant="default">
          Data: Seed (Live updates available with API key)
        </Badge>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input placeholder="Search stocks..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} options={[{
        value: 'all',
        label: 'All Sectors'
      }, ...sectors.map(s => ({
        value: s,
        label: s
      }))]} />
        <Select value={sortBy} onChange={e => setSortBy(e.target.value)} options={[{
        value: 'mcap',
        label: 'Sort by Market Cap'
      }, {
        value: 'ch1d',
        label: 'Sort by 1D Change'
      }, {
        value: 'pe',
        label: 'Sort by P/E'
      }]} />
        <div className="text-sm text-slate-600 flex items-center">
          {filteredStocks.length} stocks
        </div>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map(stock => <StockCard key={stock.symbol} stock={stock} type="US" onAddToWatchlist={() => handleAddToWatchlist(stock)} onClick={() => {}} isInWatchlist={isInWatchlist(stock.symbol, 'stock-us')} />)}
      </div>
    </PageContainer>;
}