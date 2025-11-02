import React, { useState } from 'react';
import { TargetIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { goals } from '../../data/seed';
import { addGoalLink } from '../../lib/goalLinks';
import { fmtINR } from '../../lib/marketUtils';
interface QuickAddToGoalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    id: string;
    name: string;
    type: 'fund' | 'crypto' | 'stock-in' | 'stock-us';
  };
  suggestedAmount?: number;
}
export function QuickAddToGoal({
  isOpen,
  onClose,
  asset,
  suggestedAmount = 5000
}: QuickAddToGoalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || '');
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return;
    addGoalLink({
      goalId: goal.id,
      goalName: goal.name,
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      amount: parseFloat(amount)
    });
    onClose();
  };
  const selectedGoal = goals.find(g => g.id === selectedGoalId);
  return <Modal isOpen={isOpen} onClose={onClose} title="Link to Goal" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Asset:{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {asset.name}
            </span>
          </p>
        </div>

        <Select label="Select Goal" value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)} options={goals.map(g => ({
        value: g.id,
        label: `${g.name} (${fmtINR(g.target)})`
      }))} />

        {selectedGoal && <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Target:</span>{' '}
              {fmtINR(selectedGoal.target)}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Current SIP:</span>{' '}
              {fmtINR(selectedGoal.sip)}/month
            </p>
          </div>}

        <Input label="Monthly SIP Amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} helperText="Suggested based on your current allocation" required />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <TargetIcon className="w-4 h-4 mr-2" />
            Link to Goal
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>;
}