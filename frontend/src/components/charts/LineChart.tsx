import React from 'react';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
}
export function LineChart({
  data,
  dataKey,
  xAxisKey,
  color = '#2563EB'
}: LineChartProps) {
  return <ResponsiveContainer width="100%" height={200}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} tick={{
        fill: '#64748b',
        fontSize: 12
      }} stroke="#cbd5e1" />
        <YAxis tick={{
        fill: '#64748b',
        fontSize: 12
      }} stroke="#cbd5e1" />
        <Tooltip contentStyle={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }} formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{
        fill: color,
        r: 4
      }} />
      </RechartsLine>
    </ResponsiveContainer>;
}