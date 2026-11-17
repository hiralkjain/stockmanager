import { StockResponse, UserProfile } from '../types';

const TOKEN_KEY = 'stockpilot_auth_token';
const USER_KEY = 'stockpilot_auth_user';
const RECENT_STOCKS_KEY = 'stockpilot_recent_stocks';

export const storage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to save token to localStorage', e);
    }
  },

  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove token from localStorage', e);
    }
  },

  getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser(user: UserProfile): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  },

  removeUser(): void {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to remove user from localStorage', e);
    }
  },

  clearAuth(): void {
    storage.removeToken();
    storage.removeUser();
  },

  getRecentStocks(): StockResponse[] {
    try {
      const data = localStorage.getItem(RECENT_STOCKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentStock(stock: StockResponse): void {
    try {
      const current = storage.getRecentStocks().filter((s) => s.id !== stock.id);
      const updated = [stock, ...current].slice(0, 8); // Keep top 8 recent
      localStorage.setItem(RECENT_STOCKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent stock', e);
    }
  },
};
