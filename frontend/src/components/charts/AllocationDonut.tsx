import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

interface AllocationDonutProps {
  data?: AllocationItem[];
}

const defaultAllocation: AllocationItem[] = [
  { name: 'Technology', value: 42, color: '#0F172A' },
  { name: 'Financials', value: 24, color: '#10B981' },
  { name: 'Healthcare', value: 16, color: '#0EA5E9' },
  { name: 'Consumer Cyclical', value: 12, color: '#F59E0B' },
  { name: 'Cash & Equivalents', value: 6, color: '#94A3B8' },
];

export const AllocationDonut: React.FC<AllocationDonutProps> = ({
  data = defaultAllocation,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as AllocationItem;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-dropdown text-xs">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-slate-600 mt-0.5">{item.value}% of Portfolio</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-xs">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 font-medium truncate max-w-[110px]">
                {item.name}
              </span>
            </div>
            <span className="font-semibold text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
