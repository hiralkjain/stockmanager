import apiClient from './api';
import {
  AuthResponse,
  LoginRequest,
  UserRegisterRequest,
  UserResponse,
} from '../types';

export const authService = {
  /**
   * Registers a new user.
   * POST /api/users/register
   */
  async register(data: UserRegisterRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/api/users/register', data);
    return response.data;
  },

  /**
   * Logs in an existing user and returns JWT token.
   * POST /api/users/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/users/login', credentials);
    return response.data;
  },
};
