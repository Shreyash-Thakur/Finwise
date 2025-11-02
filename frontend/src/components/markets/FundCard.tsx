import React, { useState } from 'react';
import { TrendingUpIcon, StarIcon, BellIcon, TargetIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PriceAlertModal } from '../alerts/PriceAlertModal';
import { QuickAddToGoal } from '../goals/QuickAddToGoal';
import { MutualFund } from '../../data/markets/funds';
import { fmtINR, pctAbs, abbr } from '../../lib/marketUtils';
interface FundCardProps {
  fund: MutualFund;
  onAddToWatchlist: () => void;
  onViewDetails: () => void;
  isInWatchlist: boolean;
}
export function FundCard({
  fund,
  onAddToWatchlist,
  onViewDetails,
  isInWatchlist
}: FundCardProps) {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const riskVariant = fund.risk === 'High' ? 'danger' : fund.risk === 'Moderate' ? 'warning' : 'success';
  return <>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {fund.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">{fund.category}</Badge>
              <Badge variant={riskVariant}>{fund.risk} Risk</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setShowAlertModal(true)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" title="Set price alert">
              <BellIcon className="w-4 h-4" />
            </button>
            <button onClick={onAddToWatchlist} className={`p-2 rounded-lg transition-colors ${isInWatchlist ? 'text-warning-600 bg-warning-50 dark:bg-warning-900/20' : 'text-slate-400 hover:text-warning-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`} title="Add to watchlist">
              <StarIcon className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">NAV</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {fmtINR(fund.nav)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              1Y Return
            </p>
            <p className="text-lg font-bold text-success-600">
              {pctAbs(fund.oneY)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">AUM</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {abbr(fund.aumCr * 10000000)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-3">
          <span>3Y: {pctAbs(fund.threeY)}</span>
          <span>5Y: {pctAbs(fund.fiveY)}</span>
          <span>Expense: {fund.expense}%</span>
        </div>

        <div className="flex gap-2">
          <Button onClick={onViewDetails} variant="ghost" size="sm" className="flex-1 border border-slate-300 dark:border-slate-600">
            View Details
          </Button>
          <Button onClick={() => setShowGoalModal(true)} variant="ghost" size="sm" className="border border-slate-300 dark:border-slate-600" title="Link to goal">
            <TargetIcon className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <PriceAlertModal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} asset={{
      id: fund.id,
      name: fund.name,
      type: 'fund',
      currentPrice: fund.nav
    }} />

      <QuickAddToGoal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} asset={{
      id: fund.id,
      name: fund.name,
      type: 'fund'
    }} suggestedAmount={fund.sipMin} />
    </>;
}