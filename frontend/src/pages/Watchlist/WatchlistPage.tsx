import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { watchlistService } from '../../services/watchlistService';
import { stockService } from '../../services/stockService';
import { WatchlistResponse, StockResponse } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { WatchlistTable } from '../../components/watchlist/WatchlistTable';
import { AddToWatchlistModal } from '../../components/watchlist/AddToWatchlistModal';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';
import {
  BookmarkCheck,
  Plus,
  Search,
  RefreshCw,
  TrendingUp,
  BarChart2,
  PieChart,
} from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const { success, error: showError, info } = useToast();

  const [watchlist, setWatchlist] = useState<WatchlistResponse[]>([]);
  const [allStocks, setAllStocks] = useState<StockResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);

  useEffect(() => {
    loadWatchlistAndStocks();
  }, []);

  const loadWatchlistAndStocks = async () => {
    setIsLoading(true);
    try {
      const [watchData, stocksData] = await Promise.allSettled([
        watchlistService.getWatchlist(),
        stockService.getAllStocks(),
      ]);

      if (watchData.status === 'fulfilled') {
        setWatchlist(watchData.value);
      } else {
        showError(getErrorMessage(watchData.reason), 'Could not load watchlist');
      }

      if (stocksData.status === 'fulfilled') {
        setAllStocks(stocksData.value);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWatchlist = async () => {
    setIsRefreshing(true);
    try {
      const [watchData, stocksData] = await Promise.all([
        watchlistService.getWatchlist(),
        stockService.getAllStocks(),
      ]);
      setWatchlist(watchData);
      setAllStocks(stocksData);
      info('Watchlist refreshed');
    } catch (err) {
      showError(getErrorMessage(err), 'Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemove = async (stockId: number, symbol: string) => {
    try {
      await watchlistService.removeFromWatchlist(stockId);
      setWatchlist((prev) => prev.filter((item) => item.stock?.id !== stockId));
      success(`Removed ${symbol} from watchlist`);
    } catch (err) {
      showError(getErrorMessage(err), 'Failed to remove from watchlist');
    }
  };

  const handleAddStock = async (stockId: number) => {
    setIsAddingStock(true);
    try {
      const added = await watchlistService.addToWatchlist(stockId);
      setWatchlist((prev) => [...prev, added]);
      success(`Added ${added.stock.symbol} to watchlist!`);
    } catch (err) {
      showError(getErrorMessage(err), 'Failed to add to watchlist');
    } finally {
      setIsAddingStock(false);
    }
  };

  const watchlistedIds = useMemo(() => {
    return new Set(watchlist.map((w) => w.stock?.id));
  }, [watchlist]);

  const filteredItems = useMemo(() => {
    return watchlist.filter((item) => {
      const stock = item.stock;
      if (!stock) return false;
      return (
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.exchange.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [watchlist, searchQuery]);

  // Quick stats
  const avgPrice = useMemo(() => {
    if (watchlist.length === 0) return 0;
    const sum = watchlist.reduce((acc, curr) => acc + (curr.stock?.currentPrice || 0), 0);
    return sum / watchlist.length;
  }, [watchlist]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Personal Watchlist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitored companies and active price feeds linked to your user profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshWatchlist}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Monitored Assets</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {watchlist.length}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <BookmarkCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Average Share Price</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {formatCurrency(avgPrice)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Market Status</p>
            <p className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Pricing Active
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-subtle flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter watchlist by symbol or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
          />
        </div>
        <p className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing {filteredItems.length} of {watchlist.length} tracked
        </p>
      </div>

      {/* Watchlist Table or Empty State */}
      {isLoading ? (
        <div className="py-16">
          <Spinner size="lg" label="Retrieving your watchlist records..." />
        </div>
      ) : watchlist.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="Your watchlist is empty"
          description="Track your favorite companies to monitor live market moves and receive AI alerts. Add stocks from our catalog to get started."
          actionLabel="Explore Market Securities"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching watchlisted stocks"
          description={`None of your tracked assets match "${searchQuery}".`}
          actionLabel="Clear Filter"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <WatchlistTable
          items={filteredItems}
          onRemove={handleRemove}
          isLoading={false}
        />
      )}

      {/* Add Stock to Watchlist Modal */}
      <AddToWatchlistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableStocks={allStocks}
        watchlistedIds={watchlistedIds}
        onAddStock={handleAddStock}
        isLoading={isAddingStock}
      />
    </div>
  );
};
