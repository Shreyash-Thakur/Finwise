import React, { useEffect, useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getWatchlist, removeFromWatchlist, updateWatchlistNotes } from '../../lib/watchlist';
export function Watchlist() {
  const [watchlist, setWatchlist] = useState(getWatchlist());
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const refreshWatchlist = () => {
    setWatchlist(getWatchlist());
  };
  const handleRemove = (id: string, type: string) => {
    removeFromWatchlist(id, type);
    refreshWatchlist();
  };
  const handleSaveNotes = (id: string, type: string) => {
    updateWatchlistNotes(id, type, notesValue);
    setEditingNotes(null);
    refreshWatchlist();
  };
  const typeLabels: any = {
    fund: 'Mutual Fund',
    crypto: 'Crypto',
    'stock-in': 'Indian Stock',
    'stock-us': 'US Stock',
    bond: 'Bond'
  };
  return <PageContainer title="My Watchlist" description="Track your favorite assets">
      {watchlist.length === 0 ? <Card className="text-center py-12">
          <p className="text-slate-600 mb-2">Your watchlist is empty</p>
          <p className="text-sm text-slate-500">
            Add assets from Funds, Crypto, Stocks, or Bonds pages
          </p>
        </Card> : <div className="space-y-4">
          {watchlist.map(item => <Card key={`${item.type}-${item.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <Badge variant="default">{typeLabels[item.type]}</Badge>
                    <span className="text-sm text-slate-500">
                      {item.symbol}
                    </span>
                  </div>

                  {editingNotes === `${item.type}-${item.id}` ? <div className="flex gap-2 mt-2">
                      <Input value={notesValue} onChange={e => setNotesValue(e.target.value)} placeholder="Add notes..." className="flex-1" />
                      <Button size="sm" onClick={() => handleSaveNotes(item.id, item.type)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>
                        Cancel
                      </Button>
                    </div> : <div>
                      {item.notes ? <p className="text-sm text-slate-600 mb-2">
                          {item.notes}
                        </p> : <p className="text-sm text-slate-400 mb-2">No notes</p>}
                      <button onClick={() => {
                setEditingNotes(`${item.type}-${item.id}`);
                setNotesValue(item.notes || '');
              }} className="text-sm text-primary-600 hover:text-primary-700">
                        {item.notes ? 'Edit notes' : 'Add notes'}
                      </button>
                    </div>}

                  <p className="text-xs text-slate-500 mt-2">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                <button onClick={() => handleRemove(item.id, item.type)} className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </Card>)}
        </div>}
    </PageContainer>;
}