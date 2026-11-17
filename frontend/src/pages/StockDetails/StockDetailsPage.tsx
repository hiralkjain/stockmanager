import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { stockService } from '../../services/stockService';
import { watchlistService } from '../../services/watchlistService';
import { StockResponse, WatchlistResponse, HistoricalPricePoint } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { storage } from '../../utils/storage';
import { StockPriceChart } from '../../components/charts/StockPriceChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Spinner } from '../../components/common/Spinner';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Layers,
  BarChart3,
  Globe,
} from 'lucide-react';

export const StockDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, info } = useToast();

  const [stock, setStock] = useState<StockResponse | null>(null);
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTogglingWatchlist, setIsTogglingWatchlist] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    loadStockData(id);
  }, [id]);

  const loadStockData = async (stockId: string) => {
    setIsLoading(true);
    try {
      const stockData = await stockService.getStockById(stockId);
      setStock(stockData);

      // Add to recently viewed in localStorage
      storage.addRecentStock(stockData);

      // Check if stock is on watchlist
      try {
        const watchlist = await watchlistService.getWatchlist();
        const found = watchlist.some((w) => w.stock?.id === stockData.id);
        setIsWatchlisted(found);
      } catch (e) {
        console.warn('Watchlist check skipped', e);
      }
    } catch (err) {
      showError(getErrorMessage(err), 'Failed to load stock details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!stock) return;
    setIsTogglingWatchlist(true);
    try {
      if (isWatchlisted) {
        await watchlistService.removeFromWatchlist(stock.id);
        setIsWatchlisted(false);
        info(`Removed ${stock.symbol} from your watchlist`);
      } else {
        await watchlistService.addToWatchlist(stock.id);
        setIsWatchlisted(true);
        success(`Added ${stock.symbol} to your watchlist!`);
      }
    } catch (err) {
      showError(getErrorMessage(err), 'Watchlist Error');
    } finally {
      setIsTogglingWatchlist(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" label="Loading stock intelligence data..." />
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-base font-semibold text-slate-800">Stock not found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested ticker record does not exist in the backend database.
        </p>
        <Link to="/stocks">
          <Button variant="outline" size="sm">
            Back to Stocks Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // Sample fundamental metadata (future integration)
  const isPositive = true;
  const priceChange = 3.42;
  const priceChangePct = 1.84;

  return (
    <div className="space-y-6">
      {/* Back navigation & Quick Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant={isWatchlisted ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleToggleWatchlist}
            isLoading={isTogglingWatchlist}
            leftIcon={
              isWatchlisted ? (
                <BookmarkCheck className="w-4 h-4 fill-white" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )
            }
          >
            {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
          </Button>
        </div>
      </div>

      {/* Main Stock Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-sm">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stock.symbol}
                </h1>
                <Badge variant="outline" size="sm" className="font-mono">
                  {stock.exchange}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">ID: #{stock.id}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {stock.companyName}
              </p>
            </div>
          </div>

          {/* Current Price & Change */}
          <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {formatCurrency(stock.currentPrice)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{priceChange.toFixed(2)} (+{priceChangePct.toFixed(2)}%) Today</span>
              <DemoBadge label="Demo Delta" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Historical Price Chart */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-semibold text-slate-900">
              Historical Price Action
            </span>
            <DemoBadge label="Simulated History" tooltip="Historical pricing data curve is synthesized for demo" />
          </div>
        }
        subtitle="Interactive candlestick & area chart with timeframe filters"
        padding="md"
      >
        <StockPriceChart
          data={[]}
          currentPrice={stock.currentPrice}
          symbol={stock.symbol}
          isPositive={isPositive}
        />
      </Card>

      {/* Key Financial Metrics Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Key Financial Metrics
          </h3>
          <DemoBadge label="Demo Fundamentals" tooltip="Connects to financial API in future release" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Market Capitalization</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">$3.42T</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Mega Cap</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">P/E Ratio (TTM)</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">34.8x</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Forward: 29.2x</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">52-Week High / Low</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">$237.23 / $164.08</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">Within 4% of ATH</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Dividend Yield</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">0.45%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">$1.00 / share annual</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg Daily Volume</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">48.2M</p>
            <p className="text-[10px] text-slate-500 mt-0.5">High liquidity</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Beta (5Y Monthly)</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">1.12</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Moderate volatility</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">EPS (Diluted)</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">$6.58</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">+10.2% YoY growth</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Gross Margin</p>
            <p className="text-base font-bold text-slate-900 tabular-nums mt-1">46.2%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Industry leader</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Workspace Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-900">
              StockPilot AI Intelligence Summary
            </span>
            <DemoBadge label="AI Model Preview" tooltip="AI engine synthesis will connect in future update" />
          </div>
        }
        subtitle="Automated fundamental, technical, and sentiment evaluation"
        padding="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Consensus Verdict: Bullish (Score: 84/100)
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Strong Outperform
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {stock.companyName} demonstrates solid competitive moats, resilient free cash flows,
              and expanding operating margins. Enterprise spending and AI hardware demand provide strong
              multi-year tailwinds, partially offset by elevated valuation multiples relative to historical averages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Key Investment Drivers</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Robust balance sheet with exceptional return on invested capital (ROIC).</li>
                <li>Strong ecosystem lock-in and high recurring services revenue.</li>
                <li>Expansion into next-generation accelerated computing architectures.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs mb-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Primary Risk Factors</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Potential supply chain constraints and semiconductor fab allocation delays.</li>
                <li>Regulatory scrutiny regarding dominant marketplace positions in EU & US.</li>
                <li>Sensitivity to macroeconomic interest rate shifts impacting tech multiples.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Quarterly Earnings & Financial Results */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-900">
              Earnings & Quarterly Results
            </span>
            <DemoBadge label="Demo Earnings Data" tooltip="SEC 10-Q & 10-K scraper integration in progress" />
          </div>
        }
        subtitle="Recent quarterly reports: EPS actual vs consensus analyst consensus"
        padding="none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Quarter</th>
                <th className="py-3 px-4">Reported Date</th>
                <th className="py-3 px-4 text-right">EPS Actual</th>
                <th className="py-3 px-4 text-right">EPS Estimate</th>
                <th className="py-3 px-4 text-right">Surprise</th>
                <th className="py-3 px-6 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { q: 'Q3 2024', date: 'Oct 31, 2024', actual: '$1.64', est: '$1.60', surprise: '+2.5%', rev: '$94.9B' },
                { q: 'Q2 2024', date: 'Aug 01, 2024', actual: '$1.40', est: '$1.35', surprise: '+3.7%', rev: '$85.8B' },
                { q: 'Q1 2024', date: 'May 02, 2024', actual: '$1.53', est: '$1.50', surprise: '+2.0%', rev: '$90.8B' },
                { q: 'Q4 2023', date: 'Feb 01, 2024', actual: '$2.18', est: '$2.10', surprise: '+3.8%', rev: '$119.6B' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-semibold text-slate-900">{row.q}</td>
                  <td className="py-3 px-4 text-slate-500">{row.date}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">{row.actual}</td>
                  <td className="py-3 px-4 text-right text-slate-500 tabular-nums">{row.est}</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-600 tabular-nums">{row.surprise}</td>
                  <td className="py-3 px-6 text-right font-semibold text-slate-800 tabular-nums">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
