import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface PortfolioDataPoint {
  date: string;
  value: number;
}

interface PortfolioAreaChartProps {
  data?: PortfolioDataPoint[];
}

export const PortfolioAreaChart: React.FC<PortfolioAreaChartProps> = ({ data }) => {
  // Demo curve representing realistic 30-day portfolio performance
  const chartData = React.useMemo(() => {
    if (data && data.length > 0) return data;

    const points: PortfolioDataPoint[] = [];
    const base = 54200;
    const days = [
      'Oct 18', 'Oct 21', 'Oct 24', 'Oct 27', 'Oct 30',
      'Nov 02', 'Nov 05', 'Nov 08', 'Nov 11', 'Nov 14', 'Nov 17'
    ];
    const trend = [0, 450, 1100, 950, 1850, 2400, 2150, 3100, 3600, 4200, 4850];

    days.forEach((day, index) => {
      points.push({
        date: day,
        value: base + trend[index],
      });
    });

    return points;
  }, [data]);

  const min = Math.min(...chartData.map((d) => d.value));
  const max = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="h-64 sm:h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            dy={8}
          />
          <YAxis
            domain={[Math.floor(min * 0.98), Math.ceil(max * 1.02)]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as PortfolioDataPoint;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-dropdown text-xs">
                    <p className="text-slate-400 font-medium mb-1">{item.date}</p>
                    <p className="font-bold text-slate-900 text-sm">
                      {formatCurrency(item.value)}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      +8.95% vs Starting Balance
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#portfolioGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
