import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { watchlistService } from '../../services/watchlistService';
import { stockService } from '../../services/stockService';
import { WatchlistResponse, StockResponse, StockRequest } from '../../types';
import { storage } from '../../utils/storage';
import { getErrorMessage } from '../../services/api';
import { StatCard } from '../../components/dashboard/StatCard';
import { MarketOverview } from '../../components/dashboard/MarketOverview';
import { WatchlistPreview } from '../../components/dashboard/WatchlistPreview';
import { RecentStocks } from '../../components/dashboard/RecentStocks';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { PortfolioAreaChart } from '../../components/charts/PortfolioAreaChart';
import { Card } from '../../components/common/Card';
import { StockFormModal } from '../../components/stocks/StockFormModal';
import { DemoBadge } from '../../components/common/DemoBadge';
import {
  DollarSign,
  TrendingUp,
  BookmarkCheck,
  Briefcase,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [watchlist, setWatchlist] = useState<WatchlistResponse[]>([]);
  const [recentStocks, setRecentStocks] = useState<StockResponse[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);

  // Add Stock Modal state
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isSubmittingStock, setIsSubmittingStock] = useState(false);

  useEffect(() => {
    fetchWatchlist();
    setRecentStocks(storage.getRecentStocks());
  }, []);

  const fetchWatchlist = async () => {
    setIsLoadingWatchlist(true);
    try {
      const data = await watchlistService.getWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.warn('Watchlist fetch error (backend may be empty or offline)', err);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  const handleCreateStock = async (data: StockRequest) => {
    setIsSubmittingStock(true);
    try {
      const created = await stockService.addStock(data);
      success(`Added ${created.symbol} to market catalog!`, 'Stock Created');
      setIsAddStockOpen(false);
      // Also record into recently viewed
      storage.addRecentStock(created);
      setRecentStocks(storage.getRecentStocks());
    } catch (err) {
      showError(getErrorMessage(err), 'Failed to Add Stock');
    } finally {
      setIsSubmittingStock(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || 'Investor'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time market overview, watchlist monitor, and portfolio intelligence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge
            label="Portfolio Simulation"
            tooltip="Holdings tracking and performance metrics are simulated until brokerage sync is linked"
          />
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio Value"
          value="$59,050.00"
          change="+8.95%"
          isPositive={true}
          subtitle="vs last month"
          icon={DollarSign}
          isDemo={true}
        />
        <StatCard
          title="Total Investment"
          value="$54,200.00"
          subtitle="Cost basis across 8 holdings"
          icon={Briefcase}
          isDemo={true}
        />
        <StatCard
          title="Total Profit / Loss"
          value="+$4,850.00"
          change="+8.95%"
          isPositive={true}
          subtitle="Unrealized returns"
          icon={TrendingUp}
          isDemo={true}
        />
        <StatCard
          title="Watchlist Stocks"
          value={isLoadingWatchlist ? '...' : watchlist.length.toString()}
          subtitle="Live from Spring Boot backend"
          icon={BookmarkCheck}
          isDemo={false} // LIVE FROM BACKEND!
        />
      </div>

      {/* Portfolio Performance Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Portfolio Performance
                </span>
                <DemoBadge label="Demo Curve" tooltip="Visualizing mock portfolio equity progression" />
              </div>
            }
            subtitle="Trailing 30-day cumulative balance progression"
            action={
              <Link
                to="/portfolio"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 group"
              >
                <span>Full Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
            padding="md"
          >
            <PortfolioAreaChart />
          </Card>
        </div>

        {/* Quick Actions & Recently Viewed */}
        <div className="space-y-6">
          <QuickActions onOpenAddStock={() => setIsAddStockOpen(true)} />
          <RecentStocks stocks={recentStocks} />
        </div>
      </div>

      {/* Watchlist Preview & Market Indices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WatchlistPreview items={watchlist} isLoading={isLoadingWatchlist} />
        </div>
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
      </div>

      {/* Add Stock Modal */}
      <StockFormModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onSubmit={handleCreateStock}
        isLoading={isSubmittingStock}
      />
    </div>
  );
};
