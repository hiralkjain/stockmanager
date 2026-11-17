import React from 'react';
import { Card } from '../common/Card';
import { DemoBadge } from '../common/DemoBadge';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

interface IndexData {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const mockIndices: IndexData[] = [
  { symbol: '^GSPC', name: 'S&P 500', value: '5,893.62', change: '+0.39%', isPositive: true },
  { symbol: '^IXIC', name: 'NASDAQ', value: '18,791.81', change: '+0.60%', isPositive: true },
  { symbol: '^DJI', name: 'Dow Jones', value: '43,444.99', change: '-0.13%', isPositive: false },
  { symbol: '^RUT', name: 'Russell 2000', value: '2,303.84', change: '+0.22%', isPositive: true },
  { symbol: '^TNX', name: '10-Yr Yield', value: '4.44%', change: '-0.02%', isPositive: false },
];

export const MarketOverview: React.FC = () => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-900">Market Indices</span>
          <DemoBadge label="Demo Feed" tooltip="Live exchange feed integration coming in future release" />
        </div>
      }
      subtitle="Benchmark indices & macroeconomic indicators"
      padding="md"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {mockIndices.map((idx) => (
          <div
            key={idx.symbol}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{idx.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{idx.symbol}</span>
            </div>
            <p className="text-base font-bold text-slate-900 tracking-tight mt-1.5 tabular-nums">
              {idx.value}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span
                className={cn(
                  'inline-flex items-center text-[11px] font-semibold',
                  idx.isPositive ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {idx.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {idx.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
