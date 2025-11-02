import React from 'react';
interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}
interface TableProps {
  columns: Column[];
  data: any[];
  footer?: React.ReactNode;
}
export function Table({
  columns,
  data,
  footer
}: TableProps) {
  return <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map(col => <th key={col.key} className={`px-4 py-3 text-sm font-semibold text-slate-700 text-${col.align || 'left'}`}>
                {col.label}
              </th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
              {columns.map(col => <td key={col.key} className={`px-4 py-3 text-sm text-slate-900 text-${col.align || 'left'}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>)}
            </tr>)}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>;
}