import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { WatchlistResponse } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { BookmarkCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';

interface WatchlistPreviewProps {
  items: WatchlistResponse[];
  isLoading: boolean;
}

export const WatchlistPreview: React.FC<WatchlistPreviewProps> = ({
  items,
  isLoading,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-900">Watchlist Preview</span>
        </div>
      }
      subtitle="Tracked securities from your account"
      action={
        <Link
          to="/watchlist"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      }
      padding="none"
    >
      {isLoading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-28 bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-14 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-slate-500 mb-3">No stocks added to your watchlist yet.</p>
          <Link to="/stocks">
            <Button size="sm" variant="outline">
              Explore Available Stocks
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.slice(0, 5).map((w) => {
            const stock = w.stock;
            return (
              <Link
                key={w.id}
                to={`/stocks/${stock.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-800 group-hover:bg-slate-200 transition-colors">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                      {stock.companyName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatCurrency(stock.currentPrice)}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center justify-end gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>Active</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
};
