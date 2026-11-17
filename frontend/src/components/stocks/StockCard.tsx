import React from 'react';
import { Link } from 'react-router-dom';
import { StockResponse } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Bookmark, BookmarkCheck, ArrowRight, TrendingUp, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

interface StockCardProps {
  stock: StockResponse;
  isWatchlisted: boolean;
  onToggleWatchlist: (stock: StockResponse) => void;
  onEdit?: (stock: StockResponse) => void;
  onDelete?: (stock: StockResponse) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  isWatchlisted,
  onToggleWatchlist,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Symbol & Watchlist Toggle */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">{stock.symbol}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                  {stock.exchange}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5" title={stock.companyName}>
                {stock.companyName}
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleWatchlist(stock)}
            className={`p-2 rounded-lg border transition-colors ${
              isWatchlisted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isWatchlisted ? (
              <BookmarkCheck className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Price Display */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Current Price</p>
              <p className="text-xl font-bold text-slate-900 tabular-nums">
                {formatCurrency(stock.currentPrice)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              Live Quote
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link to={`/stocks/${stock.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full justify-between group">
            <span>Analyze Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(stock)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Stock"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(stock)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Stock"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
