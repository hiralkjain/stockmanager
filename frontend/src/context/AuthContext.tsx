import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, LoginRequest, UserProfile, UserRegisterRequest, UserResponse } from '../types';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT payload safely without external library
function parseJwtEmail(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.sub || parsed.email || null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [user, setUser] = useState<UserProfile | null>(() => storage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error: showError, info } = useToast();

  const logout = useCallback(() => {
    storage.clearAuth();
    setToken(null);
    setUser(null);
    info('You have been logged out.');
  }, [info]);

  // Initial load check
  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(storedUser);
      } else {
        const emailFromJwt = parseJwtEmail(storedToken);
        if (emailFromJwt) {
          const derivedUser: UserProfile = {
            email: emailFromJwt,
            name: emailFromJwt.split('@')[0],
          };
          setUser(derivedUser);
          storage.setUser(derivedUser);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for unauthorized events emitted by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const jwtToken = response.token;

      // Extract username/email
      const email = credentials.email;
      const userProfile: UserProfile = {
        email,
        name: email.split('@')[0],
      };

      storage.setToken(jwtToken);
      storage.setUser(userProfile);

      setToken(jwtToken);
      setUser(userProfile);

      success('Welcome back to StockPilot AI!', 'Login Successful');
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: UserRegisterRequest): Promise<UserResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      success('Account created successfully! You can now log in.', 'Registration Complete');
      return res;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
