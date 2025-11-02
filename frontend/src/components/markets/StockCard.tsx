import React from 'react';
import { StarIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkline } from './Sparkline';
import { fmtINR, fmtUSD, pct, abbr, abbrUS } from '../../lib/marketUtils';
interface StockCardProps {
  stock: {
    symbol: string;
    name: string;
    ltp?: number;
    price?: number;
    ch1d: number;
    pe: number;
    mcapCr?: number;
    mcapBn?: number;
    sector: string;
    spark: number[];
  };
  type: 'IN' | 'US';
  onAddToWatchlist: () => void;
  onClick: () => void;
  isInWatchlist: boolean;
}
export function StockCard({
  stock,
  type,
  onAddToWatchlist,
  onClick,
  isInWatchlist
}: StockCardProps) {
  const isPositive = stock.ch1d >= 0;
  const price = type === 'IN' ? stock.ltp : stock.price;
  const mcap = type === 'IN' ? stock.mcapCr : stock.mcapBn;
  return <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{stock.symbol}</h3>
            <Badge variant="default">{stock.sector}</Badge>
          </div>
          <p className="text-sm text-slate-600 mb-2">{stock.name}</p>
          <p className="text-2xl font-bold text-slate-900">
            {type === 'IN' ? fmtINR(price!) : fmtUSD(price!)}
          </p>
        </div>
        <button onClick={e => {
        e.stopPropagation();
        onAddToWatchlist();
      }} className={`p-2 rounded-lg transition-colors ${isInWatchlist ? 'text-warning-600 bg-warning-50' : 'text-slate-400 hover:text-warning-600 hover:bg-slate-50'}`}>
          <StarIcon className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
          {pct(stock.ch1d)} 1D
        </span>
        <span className="text-sm text-slate-600">
          P/E: {stock.pe.toFixed(1)}
        </span>
        <span className="text-sm text-slate-600">
          MCap:{' '}
          {type === 'IN' ? abbr(mcap! * 10000000) : abbrUS(mcap! * 1000000000)}
        </span>
      </div>

      <Sparkline data={stock.spark} width={200} height={40} color="auto" />
    </Card>;
}