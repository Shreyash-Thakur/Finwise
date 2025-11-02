import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { CryptoCard } from '../../components/markets/CryptoCard';
import { Modal } from '../../components/ui/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cryptoList } from '../../data/markets/crypto';
import { addToWatchlist, isInWatchlist } from '../../lib/watchlist';
import { fmtINR, fmtUSD } from '../../lib/marketUtils';
export function Crypto() {
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [convertAmount, setConvertAmount] = useState('1');
  const [convertDirection, setConvertDirection] = useState<'inr-to-crypto' | 'crypto-to-inr'>('inr-to-crypto');
  const handleAddToWatchlist = (crypto: any) => {
    addToWatchlist({
      id: crypto.id,
      type: 'crypto',
      symbol: crypto.symbol,
      name: crypto.name
    });
  };
  const chartData = selectedCrypto?.spark.map((price: number, idx: number) => ({
    day: `D${idx + 1}`,
    price
  })) || [];
  const convertedValue = selectedCrypto ? convertDirection === 'inr-to-crypto' ? (parseFloat(convertAmount) || 0) / selectedCrypto.priceINR : (parseFloat(convertAmount) || 0) * selectedCrypto.priceINR : 0;
  return <PageContainer title="Cryptocurrency" description="Track top cryptocurrencies in INR">
      <div className="mb-4">
        <Badge variant="default">
          Data: Seed (Live updates available with API key)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptoList.map(crypto => <CryptoCard key={crypto.id} crypto={crypto} onAddToWatchlist={() => handleAddToWatchlist(crypto)} onClick={() => setSelectedCrypto(crypto)} isInWatchlist={isInWatchlist(crypto.id, 'crypto')} />)}
      </div>

      {/* Crypto Detail Modal */}
      {selectedCrypto && <Modal isOpen={!!selectedCrypto} onClose={() => setSelectedCrypto(null)} title={`${selectedCrypto.name} (${selectedCrypto.symbol})`} size="lg">
          <div className="space-y-6">
            {/* Price Chart */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                Price Trend (7 Days)
              </h3>
              <LineChart data={chartData} dataKey="price" xAxisKey="day" color="#2563EB" />
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Price (INR)</p>
                <p className="text-2xl font-bold text-slate-900">
                  {fmtINR(selectedCrypto.priceINR)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Price (USD)</p>
                <p className="text-2xl font-bold text-slate-900">
                  {fmtUSD(selectedCrypto.priceUSD)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">24h Change</p>
                <p className={`text-xl font-bold ${selectedCrypto.ch24h >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {selectedCrypto.ch24h >= 0 ? '+' : ''}
                  {selectedCrypto.ch24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">7d Change</p>
                <p className={`text-xl font-bold ${selectedCrypto.ch7d >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {selectedCrypto.ch7d >= 0 ? '+' : ''}
                  {selectedCrypto.ch7d.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Converter */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">
                Quick Converter
              </h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button variant={convertDirection === 'inr-to-crypto' ? 'primary' : 'ghost'} size="sm" onClick={() => setConvertDirection('inr-to-crypto')}>
                    INR → {selectedCrypto.symbol}
                  </Button>
                  <Button variant={convertDirection === 'crypto-to-inr' ? 'primary' : 'ghost'} size="sm" onClick={() => setConvertDirection('crypto-to-inr')}>
                    {selectedCrypto.symbol} → INR
                  </Button>
                </div>
                <Input type="number" value={convertAmount} onChange={e => setConvertAmount(e.target.value)} label={convertDirection === 'inr-to-crypto' ? 'Amount (INR)' : `Amount (${selectedCrypto.symbol})`} />
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-slate-600 mb-1">
                    {convertDirection === 'inr-to-crypto' ? `You get` : 'Equals'}
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {convertDirection === 'inr-to-crypto' ? `${convertedValue.toFixed(8)} ${selectedCrypto.symbol}` : fmtINR(convertedValue)}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => handleAddToWatchlist(selectedCrypto)} className="w-full">
              Add to Watchlist
            </Button>
          </div>
        </Modal>}
    </PageContainer>;
}