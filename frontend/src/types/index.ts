// ==========================================
// Backend Synchronized Types & DTOs
// ==========================================

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface StockResponse {
  id: number;
  symbol: string;
  companyName: string;
  exchange: string;
  currentPrice: number;
}

export interface StockRequest {
  symbol: string;
  companyName: string;
  exchange: string;
  currentPrice: number;
}

export interface WatchlistResponse {
  id: number;
  user: UserResponse;
  stock: StockResponse;
  addedAt: string;
}

// ==========================================
// Authentication State Types
// ==========================================

export interface UserProfile {
  id?: number;
  name?: string;
  email: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: UserRegisterRequest) => Promise<UserResponse>;
  logout: () => void;
}

// ==========================================
// UI & Dashboard Types
// ==========================================

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

export interface HistoricalPricePoint {
  date: string;
  price: number;
  volume: number;
}

export interface StockDetailsExtended extends StockResponse {
  change24h?: number;
  changePercent24h?: number;
  marketCap?: string;
  peRatio?: number;
  week52High?: number;
  week52Low?: number;
  volume?: string;
  avgVolume?: string;
  dividendYield?: number;
  beta?: number;
  sector?: string;
  industry?: string;
  ceo?: string;
  employees?: string;
  headquarters?: string;
  description?: string;
}

export interface PortfolioHolding {
  id: string;
  stockId: number;
  symbol: string;
  companyName: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocationPercent: number;
  sector: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export interface EarningsQuarter {
  quarter: string;
  fiscalYear: string;
  reportedDate: string;
  epsActual: number;
  epsEstimated: number;
  revenueActual: string;
  revenueEstimated: string;
  surprisePercent: number;
}

export interface AICompanyAnalysis {
  ticker: string;
  companyName: string;
  overallRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform' | 'Sell';
  sentimentScore: number; // 0 to 100
  summary: string;
  strengths: string[];
  risks: string[];
  bullishFactors: string[];
  bearishFactors: string[];
  technicalOutlook: string;
  fundamentalOutlook: string;
  lastUpdated: string;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  relatedTickers: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tickersMentioned?: string[];
}
