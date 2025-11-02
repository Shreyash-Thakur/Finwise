import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { fmtINR, pct } from '../../utils/formatters';
interface IndexCardProps {
  index: {
    name: string;
    value: number;
    changePct: number;
  };
}
export function IndexCard({
  index
}: IndexCardProps) {
  const isPositive = index.changePct >= 0;
  return <Card padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{index.name}</p>
          <p className="text-2xl font-bold text-slate-900">
            {index.name.includes('BITCOIN') || index.name.includes('GOLD') ? fmtINR(index.value) : index.value.toLocaleString('en-IN')}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
          {isPositive ? <TrendingUpIcon className="w-5 h-5" /> : <TrendingDownIcon className="w-5 h-5" />}
          <span className="font-semibold">
            {pct(Math.abs(index.changePct))}
          </span>
        </div>
      </div>
    </Card>;
}