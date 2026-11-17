import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { stockService } from '../../services/stockService';
import { watchlistService } from '../../services/watchlistService';
import { StockResponse, StockRequest, WatchlistResponse } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { storage } from '../../utils/storage';
import { StockCard } from '../../components/stocks/StockCard';
import { StockTable } from '../../components/stocks/StockTable';
import { StockFormModal } from '../../components/stocks/StockFormModal';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  Sparkles,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

const SEED_STOCKS: StockRequest[] = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', exchange: 'NASDAQ', currentPrice: 228.24 },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', exchange: 'NASDAQ', currentPrice: 141.98 },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', exchange: 'NASDAQ', currentPrice: 423.46 },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', exchange: 'NASDAQ', currentPrice: 202.88 },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', exchange: 'NASDAQ', currentPrice: 175.98 },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', exchange: 'NASDAQ', currentPrice: 338.74 },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', exchange: 'NYSE', currentPrice: 242.15 },
  { symbol: 'BRK.B', companyName: 'Berkshire Hathaway Inc.', exchange: 'NYSE', currentPrice: 468.90 },
];

export const StocksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { success, error: showError, info } = useToast();

  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & display
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedExchange, setSelectedExchange] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<StockResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stocksData, watchlistData] = await Promise.allSettled([
        stockService.getAllStocks(),
        watchlistService.getWatchlist(),
      ]);

      if (stocksData.status === 'fulfilled') {
        setStocks(stocksData.value);
      } else {
        showError(getErrorMessage(stocksData.reason), 'Could not load stocks');
      }

      if (watchlistData.status === 'fulfilled') {
        setWatchlist(watchlistData.value);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [stocksData, watchlistData] = await Promise.all([
        stockService.getAllStocks(),
        watchlistService.getWatchlist(),
      ]);
      setStocks(stocksData);
      setWatchlist(watchlistData);
      info('Stock listings synchronized with backend');
    } catch (err) {
      showError(getErrorMessage(err), 'Refresh Failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Set of watchlisted stock IDs for O(1) lookup
  const watchlistedStockIds = useMemo(() => {
    return new Set(watchlist.map((w) => w.stock?.id));
  }, [watchlist]);

  // Exchanges list for tabs
  const exchanges = useMemo(() => {
    const set = new Set<string>();
    stocks.forEach((s) => s.exchange && set.add(s.exchange.toUpperCase()));
    return ['ALL', ...Array.from(set)];
  }, [stocks]);

  // Filtered stocks
  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      const matchesSearch =
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExchange =
        selectedExchange === 'ALL' ||
        s.exchange.toUpperCase() === selectedExchange;
      return matchesSearch && matchesExchange;
    });
  }, [stocks, searchQuery, selectedExchange]);

  const handleToggleWatchlist = async (stock: StockResponse) => {
    const isWatchlisted = watchlistedStockIds.has(stock.id);
    try {
      if (isWatchlisted) {
        await watchlistService.removeFromWatchlist(stock.id);
        setWatchlist((prev) => prev.filter((w) => w.stock?.id !== stock.id));
        info(`Removed ${stock.symbol} from watchlist`);
      } else {
        const added = await watchlistService.addToWatchlist(stock.id);
        setWatchlist((prev) => [...prev, added]);
        success(`Added ${stock.symbol} to your watchlist!`);
      }
    } catch (err) {
      showError(getErrorMessage(err), 'Watchlist Update Failed');
    }
  };

  const handleFormSubmit = async (data: StockRequest) => {
    setIsSubmitting(true);
    try {
      if (editingStock) {
        const updated = await stockService.updateStock(editingStock.id, data);
        setStocks((prev) =>
          prev.map((s) => (s.id === editingStock.id ? updated : s))
        );
        success(`Updated stock ${updated.symbol}`);
      } else {
        const created = await stockService.addStock(data);
        setStocks((prev) => [created, ...prev]);
        success(`Added ${created.symbol} to market catalog`);
      }
      setIsModalOpen(false);
      setEditingStock(null);
    } catch (err) {
      showError(getErrorMessage(err), 'Failed to Save Stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStock = async (stock: StockResponse) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${stock.symbol} (${stock.companyName}) from the backend database?`
      )
    ) {
      return;
    }

    try {
      await stockService.deleteStock(stock.id);
      setStocks((prev) => prev.filter((s) => s.id !== stock.id));
      setWatchlist((prev) => prev.filter((w) => w.stock?.id !== stock.id));
      success(`Deleted ${stock.symbol}`);
    } catch (err) {
      showError(getErrorMessage(err), 'Delete Failed');
    }
  };

  // Helper: Seed initial popular stocks if database is brand new and empty
  const handleSeedSampleStocks = async () => {
    setIsSeeding(true);
    try {
      let addedCount = 0;
      for (const item of SEED_STOCKS) {
        // Skip if already in list
        if (stocks.some((s) => s.symbol === item.symbol)) continue;
        try {
          await stockService.addStock(item);
          addedCount++;
        } catch {
          // Ignore individual dupes
        }
      }
      const refreshed = await stockService.getAllStocks();
      setStocks(refreshed);
      success(`Seeded ${addedCount} sample stocks to the backend!`);
    } catch (err) {
      showError(getErrorMessage(err), 'Seeding Failed');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Market Securities Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore, analyze, and manage equities available across exchanges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stocks.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleStocks}
              isLoading={isSeeding}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Seed Sample Tickers
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingStock(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Stock
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-subtle">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by symbol or company name (e.g. AAPL, Apple)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
          />
        </div>

        {/* Exchange Filter Tabs & View Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          {/* Exchange Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {exchanges.map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExchange(ex)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedExchange === ex
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-16">
          <Spinner size="lg" label="Fetching securities from backend database..." />
        </div>
      ) : filteredStocks.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title={stocks.length === 0 ? 'No stocks registered yet' : 'No matching stocks found'}
          description={
            stocks.length === 0
              ? 'Your Spring Boot database does not have any stock records yet. Click below to seed popular sample tickers or create your own.'
              : `No securities match "${searchQuery}". Try searching another symbol or clear your filter.`
          }
          actionLabel={stocks.length === 0 ? 'Seed Sample Tickers' : 'Clear Search'}
          onAction={stocks.length === 0 ? handleSeedSampleStocks : () => setSearchQuery('')}
        />
      ) : viewMode === 'table' ? (
        <StockTable
          stocks={filteredStocks}
          watchlistedStockIds={watchlistedStockIds}
          onToggleWatchlist={handleToggleWatchlist}
          onEdit={(stock) => {
            setEditingStock(stock);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteStock}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              isWatchlisted={watchlistedStockIds.has(stock.id)}
              onToggleWatchlist={handleToggleWatchlist}
              onEdit={(s) => {
                setEditingStock(s);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteStock}
            />
          ))}
        </div>
      )}

      {/* Stock Add / Edit Modal */}
      <StockFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStock(null);
        }}
        onSubmit={handleFormSubmit}
        initialStock={editingStock}
        isLoading={isSubmitting}
      />
    </div>
  );
};
