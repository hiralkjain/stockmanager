import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { StocksPage } from './pages/Stocks/StocksPage';
import { StockDetailsPage } from './pages/StockDetails/StockDetailsPage';
import { WatchlistPage } from './pages/Watchlist/WatchlistPage';
import { PortfolioPage } from './pages/Portfolio/PortfolioPage';
import { AIInsightsPage } from './pages/AIInsights/AIInsightsPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Application Workspace */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="stocks" element={<StocksPage />} />
              <Route path="stocks/:id" element={<StockDetailsPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="ai-insights" element={<AIInsightsPage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
