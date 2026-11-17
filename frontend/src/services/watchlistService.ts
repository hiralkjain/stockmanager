import apiClient from './api';
import { WatchlistResponse } from '../types';

export const watchlistService = {
  /**
   * Retrieves all stocks in the logged-in user's watchlist.
   * GET /api/watchlist
   */
  async getWatchlist(): Promise<WatchlistResponse[]> {
    const response = await apiClient.get<WatchlistResponse[]>('/api/watchlist');
    return response.data;
  },

  /**
   * Adds a stock to the user's watchlist by stockId.
   * POST /api/watchlist/{stockId}
   */
  async addToWatchlist(stockId: number): Promise<WatchlistResponse> {
    const response = await apiClient.post<WatchlistResponse>(`/api/watchlist/${stockId}`);
    return response.data;
  },

  /**
   * Removes a stock from the user's watchlist by stockId.
   * DELETE /api/watchlist/{stockId}
   */
  async removeFromWatchlist(stockId: number): Promise<void> {
    await apiClient.delete(`/api/watchlist/${stockId}`);
  },
};
