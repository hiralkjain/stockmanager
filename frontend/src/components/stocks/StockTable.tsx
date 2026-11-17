import React from 'react';
import { Link } from 'react-router-dom';
import { StockResponse } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Bookmark, BookmarkCheck, ArrowRight, Edit, Trash2 } from 'lucide-react';

interface StockTableProps {
  stocks: StockResponse[];
  watchlistedStockIds: Set<number>;
  onToggleWatchlist: (stock: StockResponse) => void;
  onEdit?: (stock: StockResponse) => void;
  onDelete?: (stock: StockResponse) => void;
}

export const StockTable: React.FC<StockTableProps> = ({
  stocks,
  watchlistedStockIds,
  onToggleWatchlist,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Symbol & Name</th>
              <th className="py-3.5 px-4">Exchange</th>
              <th className="py-3.5 px-4 text-right">Current Price</th>
              <th className="py-3.5 px-4 text-center">Watchlist</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {stocks.map((stock) => {
              const isWatchlisted = watchlistedStockIds.has(stock.id);
              return (
                <tr
                  key={stock.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Symbol & Company Name */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <Link
                      to={`/stocks/${stock.id}`}
                      className="flex items-center gap-3 group-hover:text-emerald-700"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {stock.symbol}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px] sm:max-w-xs">
                          {stock.companyName}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Exchange */}
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {stock.exchange}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(stock.currentPrice)}
                  </td>

                  {/* Watchlist toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleWatchlist(stock)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isWatchlisted
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
                      }`}
                      title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      {isWatchlisted ? (
                        <BookmarkCheck className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/stocks/${stock.id}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      {onEdit && (
                        <button
                          onClick={() => onEdit(stock)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(stock)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
