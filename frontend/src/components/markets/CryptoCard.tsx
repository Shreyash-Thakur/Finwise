import React from 'react';
import { StarIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Sparkline } from './Sparkline';
import { Crypto } from '../../data/markets/crypto';
import { fmtINR, pct, abbr } from '../../lib/marketUtils';
interface CryptoCardProps {
  crypto: Crypto;
  onAddToWatchlist: () => void;
  onClick: () => void;
  isInWatchlist: boolean;
}
export function CryptoCard({
  crypto,
  onAddToWatchlist,
  onClick,
  isInWatchlist
}: CryptoCardProps) {
  const isPositive = crypto.ch24h >= 0;
  return <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{crypto.name}</h3>
            <span className="text-sm text-slate-500">{crypto.symbol}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {fmtINR(crypto.priceINR)}
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
          {pct(crypto.ch24h)} 24h
        </span>
        <span className="text-sm text-slate-600">
          MCap: {abbr(crypto.mcapCr * 10000000)}
        </span>
      </div>

      <Sparkline data={crypto.spark} width={200} height={40} color="auto" />
    </Card>;
}