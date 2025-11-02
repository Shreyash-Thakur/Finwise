import React from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { MutualFund } from '../../data/markets/funds';
interface FundCompareBarProps {
  selectedFunds: MutualFund[];
  onRemove: (fundId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}
export function FundCompareBar({
  selectedFunds,
  onRemove,
  onCompare,
  onClear
}: FundCompareBarProps) {
  if (selectedFunds.length === 0) return null;
  return <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedFunds.length} fund{selectedFunds.length > 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedFunds.map(fund => <div key={fund.id} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm">
                  <span>{fund.name}</span>
                  <button onClick={() => onRemove(fund.id)} className="hover:text-primary-900 dark:hover:text-primary-100">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear All
            </Button>
            <Button size="sm" onClick={onCompare} disabled={selectedFunds.length < 2}>
              Compare Funds
            </Button>
          </div>
        </div>
      </div>
    </div>;
}