import React from 'react';
import { Link } from 'react-router-dom';
import { WatchlistResponse } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Trash2, ArrowRight, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '../common/Button';

interface WatchlistTableProps {
  items: WatchlistResponse[];
  onRemove: (stockId: number, symbol: string) => void;
  isLoading: boolean;
}

export const WatchlistTable: React.FC<WatchlistTableProps> = ({
  items,
  onRemove,
  isLoading,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Stock</th>
              <th className="py-3.5 px-4">Exchange</th>
              <th className="py-3.5 px-4 text-right">Current Price</th>
              <th className="py-3.5 px-4">Added On</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item) => {
              const stock = item.stock;
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
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

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {stock.exchange}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(stock.currentPrice)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 flex items-center gap-1.5 pt-4">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(item.addedAt)}</span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/stocks/${stock.id}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Analyze</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => onRemove(stock.id, stock.symbol)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove from Watchlist"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
