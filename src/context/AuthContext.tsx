'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'student' | 'faculty' | 'admin';
  profile?: {
    firstName?: string;
    lastName?: string;
    studentId?: string;
    semester?: number;
    program?: string;
    department?: string;
    profileImage?: string;
    phone?: string;
    address?: string;
  };
  settings?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');

          if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: { user: User; token: string }) => {
    setUser(userData.user);
    setToken(userData.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

// Hook for making authenticated API requests
export const useAuthenticatedRequest = () => {
  const { token, logout } = useAuth();

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, logout user
    if (response.status === 401) {
      logout();
      window.location.href = '/auth';
      return null;
    }

    return response;
  };

  return { makeRequest };
}; 