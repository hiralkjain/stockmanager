import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Modal } from '../../components/common/Modal';
import { PortfolioAreaChart } from '../../components/charts/PortfolioAreaChart';
import { AllocationDonut } from '../../components/charts/AllocationDonut';
import { formatCurrency, formatPercent, getGainLossColor } from '../../utils/formatters';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  PieChart,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MockHolding {
  id: string;
  symbol: string;
  companyName: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPct: number;
  allocationPct: number;
  sector: string;
}

const SAMPLE_HOLDINGS: MockHolding[] = [
  {
    id: '1',
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    shares: 80,
    avgCost: 115.0,
    currentPrice: 141.98,
    totalCost: 9200.0,
    currentValue: 11358.4,
    gainLoss: 2158.4,
    gainLossPct: 23.46,
    allocationPct: 19.2,
    sector: 'Technology',
  },
  {
    id: '2',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 45,
    avgCost: 195.4,
    currentPrice: 228.24,
    totalCost: 8793.0,
    currentValue: 10270.8,
    gainLoss: 1477.8,
    gainLossPct: 16.81,
    allocationPct: 17.4,
    sector: 'Technology',
  },
  {
    id: '3',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 22,
    avgCost: 395.0,
    currentPrice: 423.46,
    totalCost: 8690.0,
    currentValue: 9316.12,
    gainLoss: 626.12,
    gainLossPct: 7.21,
    allocationPct: 15.8,
    sector: 'Technology',
  },
  {
    id: '4',
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    shares: 35,
    avgCost: 198.5,
    currentPrice: 242.15,
    totalCost: 6947.5,
    currentValue: 8475.25,
    gainLoss: 1527.75,
    gainLossPct: 21.99,
    allocationPct: 14.3,
    sector: 'Financials',
  },
  {
    id: '5',
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    shares: 38,
    avgCost: 182.0,
    currentPrice: 202.88,
    totalCost: 6916.0,
    currentValue: 7709.44,
    gainLoss: 793.44,
    gainLossPct: 11.47,
    allocationPct: 13.1,
    sector: 'Consumer Cyclical',
  },
  {
    id: '6',
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    shares: 40,
    avgCost: 164.2,
    currentPrice: 175.98,
    totalCost: 6568.0,
    currentValue: 7039.2,
    gainLoss: 471.2,
    gainLossPct: 7.17,
    allocationPct: 11.9,
    sector: 'Technology',
  },
];

export const PortfolioPage: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Totals calculated from sample holdings
  const totalInvested = SAMPLE_HOLDINGS.reduce((sum, h) => sum + h.totalCost, 0);
  const totalValue = SAMPLE_HOLDINGS.reduce((sum, h) => sum + h.currentValue, 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPct = (totalGainLoss / totalInvested) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Portfolio Holdings & Performance
            </h1>
            <DemoBadge label="Beta Workspace" tooltip="Backend portfolio persistence is scheduled for future release" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time position values, unrealized gains, and sector asset distribution.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsDemoModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Position
        </Button>
      </div>

      {/* Integration Notice Alert Banner */}
      <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold">Future-Ready Architecture Notice</p>
          <p className="text-amber-800 mt-0.5">
            The Spring Boot backend does not currently have portfolio entity endpoints implemented.
            All portfolio records, performance calculations, and sector breakdowns shown on this page
            are sample structures designed for direct wiring to future `/api/portfolio` endpoints.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Current Portfolio Value</span>
            <DemoBadge size="sm" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(totalValue)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            +$840.50 (+1.44%) Today
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Invested Capital</span>
            <DemoBadge size="sm" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(totalInvested)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Cost basis across {SAMPLE_HOLDINGS.length} securities
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Unrealized Return</span>
            <DemoBadge size="sm" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 tabular-nums">
            +{formatCurrency(totalGainLoss)}
          </p>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            +{totalGainLossPct.toFixed(2)}% Overall Return
          </p>
        </div>
      </div>

      {/* Performance Curve & Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Historical Net Asset Value
                </span>
                <DemoBadge label="Demo Curve" />
              </div>
            }
            subtitle="Trailing performance over past 30 days"
            padding="md"
          >
            <PortfolioAreaChart />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card
            title={
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Sector Allocation
                </span>
                <DemoBadge label="Demo Breakdown" />
              </div>
            }
            subtitle="Weight distribution across asset sectors"
            padding="md"
          >
            <AllocationDonut />
          </Card>
        </div>
      </div>

      {/* Holdings Table */}
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Current Equity Positions
              </span>
              <DemoBadge label="Sample Holdings" />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {SAMPLE_HOLDINGS.length} Positions
            </span>
          </div>
        }
        subtitle="Individual share counts, cost basis, and profit/loss"
        padding="none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Asset</th>
                <th className="py-3.5 px-4 text-right">Shares</th>
                <th className="py-3.5 px-4 text-right">Avg Cost</th>
                <th className="py-3.5 px-4 text-right">Market Price</th>
                <th className="py-3.5 px-4 text-right">Total Value</th>
                <th className="py-3.5 px-4 text-right">Return ($ / %)</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Allocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SAMPLE_HOLDINGS.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
                        {h.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{h.symbol}</span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {h.companyName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800 tabular-nums">
                    {h.shares}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 tabular-nums">
                    {formatCurrency(h.avgCost)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(h.currentPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(h.currentValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums">
                    <span className="font-bold text-emerald-600">
                      +{formatCurrency(h.gainLoss)}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-medium">
                      +{h.gainLossPct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-semibold text-slate-800 tabular-nums">
                    {h.allocationPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feature Demo Explanation Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Portfolio Service Integration Status"
        description="Upcoming feature in StockPilot AI backend roadmap"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            The Spring Boot backend does not currently include a portfolio controller or database
            entity. In accordance with system instructions, we do not fake API requests or simulate false saves.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-semibold text-slate-800 mb-1">Roadmap for Backend:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Add <code className="font-mono text-slate-800">PortfolioHolding</code> and <code className="font-mono text-slate-800">Transaction</code> JPA entities.</li>
              <li>Expose <code className="font-mono text-slate-800">POST /api/portfolio/buy</code> & <code className="font-mono text-slate-800">sell</code> endpoints.</li>
              <li>Connect frontend directly to calculate real cost-basis and portfolio equity.</li>
            </ul>
          </div>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
