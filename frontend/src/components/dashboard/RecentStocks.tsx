import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { StockResponse } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { History, ArrowUpRight } from 'lucide-react';

interface RecentStocksProps {
  stocks: StockResponse[];
}

export const RecentStocks: React.FC<RecentStocksProps> = ({ stocks }) => {
  if (stocks.length === 0) {
    return (
      <Card
        title={
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-900">Recently Viewed</span>
          </div>
        }
        subtitle="Recently researched tickers"
        padding="md"
      >
        <p className="text-xs text-slate-500 py-3 text-center">
          Tickers you inspect will appear here for fast access.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-900">Recently Viewed</span>
        </div>
      }
      subtitle="Quick access to recently opened stocks"
      padding="none"
    >
      <div className="divide-y divide-slate-100">
        {stocks.slice(0, 4).map((stock) => (
          <Link
            key={stock.id}
            to={`/stocks/${stock.id}`}
            className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors group"
          >
            <div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {stock.symbol}
              </span>
              <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                {stock.companyName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                {formatCurrency(stock.currentPrice)}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
