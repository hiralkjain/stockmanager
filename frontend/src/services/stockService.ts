import apiClient from './api';
import { StockRequest, StockResponse } from '../types';

export const stockService = {
  /**
   * Fetches all registered stocks.
   * GET /api/stocks
   */
  async getAllStocks(): Promise<StockResponse[]> {
    const response = await apiClient.get<StockResponse[]>('/api/stocks');
    return response.data;
  },

  /**
   * Fetches single stock details by ID.
   * GET /api/stocks/{id}
   */
  async getStockById(id: number | string): Promise<StockResponse> {
    const response = await apiClient.get<StockResponse>(`/api/stocks/${id}`);
    return response.data;
  },

  /**
   * Creates a new stock entry in the system.
   * POST /api/stocks
   */
  async addStock(stock: StockRequest): Promise<StockResponse> {
    const response = await apiClient.post<StockResponse>('/api/stocks', stock);
    return response.data;
  },

  /**
   * Updates an existing stock entry.
   * PUT /api/stocks/{id}
   */
  async updateStock(id: number | string, stock: StockRequest): Promise<StockResponse> {
    const response = await apiClient.put<StockResponse>(`/api/stocks/${id}`, stock);
    return response.data;
  },

  /**
   * Deletes a stock entry by ID.
   * DELETE /api/stocks/{id}
   */
  async deleteStock(id: number | string): Promise<string> {
    const response = await apiClient.delete<string>(`/api/stocks/${id}`);
    return response.data;
  },
};
