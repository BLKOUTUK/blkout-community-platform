// BLKOUT Liberation Platform - Authentication Hook
// Provides admin authentication and role-based access control

import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'curator' | 'member';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isCurator: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('blkout_admin_token');
        if (token) {
          // Validate token and get user info
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('blkout_admin_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Validate credentials
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check password (in production, this would be server-side)
      const VALID_PASSWORD = 'blkOUT2025!';

      if (password !== VALID_PASSWORD) {
        throw new Error('Invalid password. Please check your credentials.');
      }

      // Accept any valid email with correct password
      // Email validation is just for format, not specific addresses
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const adminUser: User = {
        id: `admin-${Date.now()}`,
        name: email.split('@')[0].replace(/[._-]/g, ' ').trim(),
        email: email.toLowerCase(),
        role: 'admin',
        permissions: [
          'moderate_content',
          'manage_curators',
          'view_analytics',
          'manage_extensions',
          'train_ivor'
        ]
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const token = `blkout_token_${Date.now()}_${btoa(email)}`;
      localStorage.setItem('blkout_admin_token', token);
      localStorage.setItem('blkout_user_data', JSON.stringify(adminUser));

      setUser(adminUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setError(message);
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = (): void => {
    localStorage.removeItem('blkout_admin_token');
    localStorage.removeItem('blkout_user_data');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isCurator = user?.role === 'curator' || isAdmin;

  return {
    user,
    isAdmin,
    isCurator,
    signIn,
    signOut,
    loading,
    error
  };
};

// Helper function to validate authentication token
const validateToken = async (token: string): Promise<User> => {
  // In development, return cached user data
  const cachedUserData = localStorage.getItem('blkout_user_data');
  if (cachedUserData) {
    return JSON.parse(cachedUserData);
  }

  // In production, this would make an API call to validate the token
  // For now, throw an error to force re-authentication
  throw new Error('Invalid token');
};

// Export the context for providers
export { AuthContext };
export type { User, AuthContextType };