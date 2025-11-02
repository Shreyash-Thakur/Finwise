import React, { useState } from 'react';
import { StarIcon, BellIcon, TargetIcon, TrendingUpIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PriceAlertModal } from '../alerts/PriceAlertModal';
import { QuickAddToGoal } from '../goals/QuickAddToGoal';
import { EnhancedFund } from '../../data/markets/fundsEnhanced';
import { formatINR, formatPercent } from '../../lib/fundHelpers';
import { abbr } from '../../lib/marketUtils';
interface EnhancedFundCardProps {
  fund: EnhancedFund;
  onAddToWatchlist: () => void;
  onViewDetails: () => void;
  onToggleCompare: () => void;
  isInWatchlist: boolean;
  isSelectedForCompare: boolean;
}
export function EnhancedFundCard({
  fund,
  onAddToWatchlist,
  onViewDetails,
  onToggleCompare,
  isInWatchlist,
  isSelectedForCompare
}: EnhancedFundCardProps) {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const riskColors = {
    Low: 'rgb(var(--positive))',
    Moderate: 'rgb(var(--warning))',
    High: 'rgb(var(--negative))'
  };
  const riskBorderColors = {
    Low: 'rgba(var(--positive), 0.3)',
    Moderate: 'rgba(var(--warning), 0.3)',
    High: 'rgba(var(--negative), 0.3)'
  };
  return <>
      <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-200" style={{
      backgroundColor: `rgb(var(--card))`,
      borderColor: `rgb(var(--border))`,
      borderTopWidth: '3px',
      borderTopColor: riskBorderColors[fund.risk]
    }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold text-base mb-2 line-clamp-2 leading-tight" style={{
            color: `rgb(var(--text))`
          }}>
              {fund.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default" style={{
              backgroundColor: `rgba(var(--accent), 0.1)`,
              color: `rgb(var(--accent))`
            }}>
                {fund.category}
              </Badge>
              <Badge style={{
              backgroundColor: `rgba(var(--${fund.risk === 'Low' ? 'positive' : fund.risk === 'Moderate' ? 'warning' : 'negative'}), 0.1)`,
              color: riskColors[fund.risk]
            }}>
                {fund.risk} Risk
              </Badge>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex flex-col gap-1">
            <button onClick={e => {
            e.stopPropagation();
            setShowAlertModal(true);
          }} className="p-1.5 rounded-lg transition-colors" style={{
            color: `rgb(var(--text-muted))`,
            backgroundColor: `rgba(var(--muted), 0.5)`
          }} title="Set price alert">
              <BellIcon className="w-4 h-4" />
            </button>
            <button onClick={e => {
            e.stopPropagation();
            onAddToWatchlist();
          }} className={`p-1.5 rounded-lg transition-colors ${isInWatchlist ? 'bg-warning-100 dark:bg-warning-900/20' : ''}`} style={{
            color: isInWatchlist ? `rgb(var(--warning))` : `rgb(var(--text-muted))`,
            backgroundColor: isInWatchlist ? undefined : `rgba(var(--muted), 0.5)`
          }} title="Add to watchlist">
              <StarIcon className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs mb-1" style={{
            color: `rgb(var(--text-muted))`
          }}>
              NAV
            </p>
            <p className="text-xl font-bold" style={{
            color: `rgb(var(--text))`
          }}>
              {formatINR(fund.nav)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{
            color: `rgb(var(--text-muted))`
          }}>
              1Y Return
            </p>
            <p className="text-xl font-bold" style={{
            color: `rgb(var(--positive))`
          }}>
              {formatPercent(fund.ret1Y, 1)}
            </p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div>
            <p style={{
            color: `rgb(var(--text-muted))`
          }}>
              3Y CAGR
            </p>
            <p className="font-semibold" style={{
            color: `rgb(var(--text))`
          }}>
              {formatPercent(fund.ret3Y, 1)}
            </p>
          </div>
          <div>
            <p style={{
            color: `rgb(var(--text-muted))`
          }}>
              5Y CAGR
            </p>
            <p className="font-semibold" style={{
            color: `rgb(var(--text))`
          }}>
              {formatPercent(fund.ret5Y, 1)}
            </p>
          </div>
          <div>
            <p style={{
            color: `rgb(var(--text-muted))`
          }}>
              Expense
            </p>
            <p className="font-semibold" style={{
            color: `rgb(var(--text))`
          }}>
              {formatPercent(fund.expense, 2)}
            </p>
          </div>
        </div>

        {/* AUM */}
        <div className="mb-4 pb-4" style={{
        borderBottom: `1px solid rgb(var(--border))`
      }}>
          <p className="text-xs mb-1" style={{
          color: `rgb(var(--text-muted))`
        }}>
            AUM:{' '}
            <span className="font-medium" style={{
            color: `rgb(var(--text))`
          }}>
              {abbr(fund.aumCr * 10000000)}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={onViewDetails} variant="ghost" size="sm" className="flex-1" style={{
          borderColor: `rgb(var(--border))`,
          color: `rgb(var(--text))`
        }}>
            View Details
          </Button>
          <Button onClick={e => {
          e.stopPropagation();
          setShowGoalModal(true);
        }} variant="ghost" size="sm" style={{
          borderColor: `rgb(var(--border))`,
          color: `rgb(var(--text))`
        }} title="Link to goal">
            <TargetIcon className="w-4 h-4" />
          </Button>
          <Button onClick={e => {
          e.stopPropagation();
          onToggleCompare();
        }} variant={isSelectedForCompare ? 'primary' : 'ghost'} size="sm" style={!isSelectedForCompare ? {
          borderColor: `rgb(var(--border))`,
          color: `rgb(var(--text))`
        } : undefined} title="Add to compare">
            {isSelectedForCompare ? '✓' : '+'}
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
    }} suggestedAmount={fund.minSip} />
    </>;
}