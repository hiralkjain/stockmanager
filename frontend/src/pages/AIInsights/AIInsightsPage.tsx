import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { DemoBadge } from '../../components/common/DemoBadge';
import {
  Sparkles,
  Send,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Info,
  Bot,
  User,
  Zap,
  Globe,
  Bell,
  Cpu,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const PRESET_PROMPTS = [
  'Summarize NVDA competitive moat vs AMD',
  'Explain P/E ratio vs PEG ratio in fintech',
  'What are the key risks for mega-cap tech in Q4?',
  'Analyze AAPL quarterly margin trends',
];

export const AIInsightsPage: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState<'NVDA' | 'AAPL' | 'MSFT' | 'TSLA'>('NVDA');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your StockPilot AI Financial Analyst. You can ask me about company fundamentals, valuation multiples, technical resistance levels, or macroeconomic catalysts. How can I assist your portfolio today?',
      time: '10:00 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'What are the main growth drivers for NVIDIA heading into next fiscal year?',
      time: '10:02 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: 'NVIDIA (NVDA) growth into FY2026 is anchored on three key pillars:\n\n1. Blackwell Architecture Adoption: Enterprise data centers are transitioning from Hopper (H100/H200) to B200/GB200 with 2.5x-4x training performance.\n2. Sovereign AI & Hyperscaler Capex: Cloud providers (Microsoft, Alphabet, Amazon, Meta) have raised 2025 capex budgets by over 20% for AI infrastructure.\n3. Networking & Software Moat: Quantum-X800 InfiniBand networking and CUDA enterprise software suite command >75% gross margins and high customer stickiness.',
      time: '10:02 AM',
    },
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated AI response with helpful disclaimer
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `[Demo AI Workspace Response for: "${userText}"]\n\nStockPilot AI is designed to integrate with Gemini & OpenAI financial models in our upcoming backend update. Real-time inference will deliver instant analysis of SEC filings, earnings call transcripts, and live price action.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  const handlePromptClick = (prompt: string) => {
    setChatInput(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              StockPilot AI Intelligence Workspace
            </h1>
            <DemoBadge label="AI Preview" tooltip="Interface ready for Gemini / LLM financial inference engine" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep-dive company fundamental audits, quarterly earnings forecasting, and conversational research.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Active Model:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            StockPilot Finance 2.0 (Preview)
          </span>
        </div>
      </div>

      {/* Integration Notice Alert */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-subtle flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">
            Welcome to the StockPilot AI Workspace Architecture
          </p>
          <p className="mt-0.5">
            This module provides the frontend framework for automated company tear-downs,
            quarterly earnings analysis, real-time market sentiment monitoring, and an interactive
            natural-language assistant.
          </p>
        </div>
      </div>

      {/* SECTION 1: Deep-Dive Company Analysis */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            1. Automated Company Fundamental Audit
          </h2>
          <DemoBadge label="Simulated Report" />
        </div>

        {/* Ticker Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['NVDA', 'AAPL', 'MSFT', 'TSLA'] as const).map((ticker) => (
            <button
              key={ticker}
              onClick={() => setSelectedTicker(ticker)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selectedTicker === ticker
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {ticker}
            </button>
          ))}
        </div>

        <Card padding="md">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedTicker === 'NVDA' && 'NVIDIA Corporation (NVDA)'}
                    {selectedTicker === 'AAPL' && 'Apple Inc. (AAPL)'}
                    {selectedTicker === 'MSFT' && 'Microsoft Corporation (MSFT)'}
                    {selectedTicker === 'TSLA' && 'Tesla Inc. (TSLA)'}
                  </h3>
                  <Badge variant="success" size="sm">
                    Bullish Rating (88/100)
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI Synthesis based on 10-K filings, earnings call transcripts, and Wall Street consensus.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-mono">Last Evaluated:</span>
                <p className="text-xs font-semibold text-slate-800">Today at Market Open</p>
              </div>
            </div>

            {/* Strengths & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200/90 bg-emerald-50/40">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Key Strengths & Growth Catalysts</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                  <li>Market share exceeding 80% in high-performance datacenter accelerators.</li>
                  <li>Exceptional operating leverage with Free Cash Flow margins exceeding 45%.</li>
                  <li>Multi-year order backlogs from tier-1 enterprise cloud hyperscalers.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-rose-200/90 bg-rose-50/40">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Identified Risk Factors</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                  <li>High customer concentration: top 4 customers account for over 35% of revenue.</li>
                  <li>Geopolitical trade restrictions impacting advanced silicon shipments to China.</li>
                  <li>Cyclicality risks if corporate AI infrastructure capex begins decelerating.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 2: Quarterly Results & Earnings Analysis */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-700" />
            2. Quarterly Results & Earnings Calendar
          </h2>
          <DemoBadge label="Demo Intelligence" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            title="Upcoming Earnings Dates"
            subtitle="Upcoming quarterly earnings calls for watchlisted stocks"
            padding="none"
            className="lg:col-span-2"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Company</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-right">Consensus EPS</th>
                    <th className="py-3 px-4 text-right">Expected Revenue</th>
                    <th className="py-3 px-6 text-right">AI Prediction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { sym: 'NVDA', name: 'NVIDIA', date: 'Nov 20, 2024 (AMC)', eps: '$0.75', rev: '$33.1B', ai: 'Likely Beat (+4%)' },
                    { sym: 'AAPL', name: 'Apple', date: 'Jan 30, 2025 (AMC)', eps: '$2.35', rev: '$124.2B', ai: 'In-line' },
                    { sym: 'MSFT', name: 'Microsoft', date: 'Jan 28, 2025 (AMC)', eps: '$3.10', rev: '$68.5B', ai: 'Likely Beat (+2%)' },
                    { sym: 'TSLA', name: 'Tesla', date: 'Jan 22, 2025 (AMC)', eps: '$0.72', rev: '$25.8B', ai: 'Volatile' },
                  ].map((row) => (
                    <tr key={row.sym} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6">
                        <span className="font-bold text-slate-900">{row.sym}</span>
                        <span className="block text-[11px] text-slate-500">{row.name}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{row.date}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">{row.eps}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800 tabular-nums">{row.rev}</td>
                      <td className="py-3 px-6 text-right font-semibold text-emerald-600">{row.ai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card
            title="Earnings Summary Engine"
            subtitle="AI consensus commentary"
            padding="md"
          >
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>Tech Sector Forecast:</strong> Wall Street consensus is pricing in 12.4% aggregate
                earnings growth for S&P 500 tech constituents.
              </p>
              <p>
                Key focus this quarter is whether AI monetization is generating meaningful top-line software revenue
                versus remaining pure infrastructure buildout.
              </p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">Real-time SEC 8-K parsing enabled in Phase 2</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 3: Market Insights & Significant Movements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-700" />
            3. AI Market Insights & Unusual Activity
          </h2>
          <DemoBadge label="Demo Stream" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-800">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Watchlist Alert: Sector Rotation</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Institutional funds rotated $1.8B from cyclical industrials into large-cap semiconductors following
              favorable export clarity.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-800">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Unusual Options Volume: NVDA</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              3.2x average call volume detected on the $150 strike expiring December 20, indicating institutional
              bullish positioning ahead of earnings.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-800">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Fed Rate Cut Impact</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Treasury yields adjusted downward to 4.44%, driving renewed expansion in fintech and high-growth
              software multiples.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: AI Conversational Chat Interface */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-slate-700" />
            4. Interactive StockPilot AI Analyst
          </h2>
          <DemoBadge label="Interactive Chat" />
        </div>

        <Card padding="none" className="overflow-hidden">
          {/* Chat message history */}
          <div className="p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto bg-slate-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-xl whitespace-pre-wrap leading-relaxed shadow-subtle ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preset Prompts Strip */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="font-semibold text-slate-500 shrink-0">Suggestions:</span>
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask StockPilot AI about any ticker, financial metric, or market trend..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!chatInput.trim()}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
