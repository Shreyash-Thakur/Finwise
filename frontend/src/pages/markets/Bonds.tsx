import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { bonds } from '../../data/markets/bonds';
import { formatDate } from '../../lib/marketUtils';
export function Bonds() {
  const columns = [{
    key: 'code',
    label: 'Bond Code',
    align: 'left' as const
  }, {
    key: 'tenor',
    label: 'Tenor',
    align: 'left' as const
  }, {
    key: 'coupon',
    label: 'Coupon %',
    align: 'right' as const,
    render: (val: number) => val === 0 ? '—' : `${val.toFixed(2)}%`
  }, {
    key: 'ytm',
    label: 'YTM %',
    align: 'right' as const,
    render: (val: number) => `${val.toFixed(2)}%`
  }, {
    key: 'price',
    label: 'Price',
    align: 'right' as const,
    render: (val: number) => val.toFixed(2)
  }, {
    key: 'risk',
    label: 'Risk',
    align: 'center' as const,
    render: (val: string) => <Badge variant={val === 'Sovereign' ? 'success' : 'primary'}>
          {val}
        </Badge>
  }, {
    key: 'maturityDate',
    label: 'Maturity',
    align: 'right' as const,
    render: (val: string) => val ? formatDate(val) : '—'
  }];
  return <PageContainer title="Government Bonds & T-Bills" description="Track sovereign and corporate bonds">
      <div className="mb-6">
        <Badge variant="default">Data: Seed (Educational purposes only)</Badge>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Available Bonds
        </h2>
        <Table columns={columns} data={bonds} />
      </Card>

      {/* Bond Ladder Builder Placeholder */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Bond Ladder Builder
        </h2>
        <p className="text-slate-600 mb-4">
          Build a bond ladder by selecting multiple tenors to create a
          diversified fixed-income portfolio with staggered maturities.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-500">Bond ladder builder coming soon</p>
        </div>
      </Card>
    </PageContainer>;
}