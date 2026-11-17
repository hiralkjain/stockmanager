import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StockResponse } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Search, Plus, Check } from 'lucide-react';

interface AddToWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStocks: StockResponse[];
  watchlistedIds: Set<number>;
  onAddStock: (stockId: number) => Promise<void>;
  isLoading: boolean;
}

export const AddToWatchlistModal: React.FC<AddToWatchlistModalProps> = ({
  isOpen,
  onClose,
  availableStocks,
  watchlistedIds,
  onAddStock,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = availableStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Stock to Watchlist"
      description="Pick from registered stocks to monitor price action."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by symbol or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
            autoFocus
          />
        </div>

        {/* Stock List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200">
          {filteredStocks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching stocks found.
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const alreadyAdded = watchlistedIds.has(stock.id);
              return (
                <div
                  key={stock.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{stock.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {stock.exchange}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {stock.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(stock.currentPrice)}
                    </span>
                    {alreadyAdded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">
                        <Check className="w-3 h-3" />
                        Added
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddStock(stock.id)}
                        disabled={isLoading}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
