import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { addAlert } from '../../lib/alerts';
interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    id: string;
    name: string;
    type: 'fund' | 'crypto' | 'stock-in' | 'stock-us';
    currentPrice: number;
  };
}
export function PriceAlertModal({
  isOpen,
  onClose,
  asset
}: PriceAlertModalProps) {
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState(asset.currentPrice.toString());
  const [note, setNote] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      condition,
      threshold: parseFloat(threshold),
      note: note || undefined
    });
    onClose();
    setThreshold(asset.currentPrice.toString());
    setNote('');
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Set Price Alert" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Asset:{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {asset.name}
            </span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Current Price:{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              ₹{asset.currentPrice.toFixed(2)}
            </span>
          </p>
        </div>

        <Select label="Alert Condition" value={condition} onChange={e => setCondition(e.target.value as 'above' | 'below')} options={[{
        value: 'above',
        label: 'Price goes above'
      }, {
        value: 'below',
        label: 'Price goes below'
      }]} />

        <Input label="Threshold Price (₹)" type="number" step="0.01" value={threshold} onChange={e => setThreshold(e.target.value)} required />

        <Input label="Note (Optional)" placeholder="e.g., Good buying opportunity" value={note} onChange={e => setNote(e.target.value)} />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <BellIcon className="w-4 h-4 mr-2" />
            Set Alert
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>;
}