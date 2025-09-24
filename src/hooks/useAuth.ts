// BLKOUT Liberation Platform - Authentication Hook
// Provides admin authentication and role-based access control

import React, { useState, useEffect, createContext, useContext } from 'react';

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

// Create the context before using it
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session from AdminAuth component
    const checkAuthStatus = async () => {
      try {
        // Check for admin session first (from AdminAuth component)
        const adminSessionData = localStorage.getItem('liberation_admin_session');
        if (adminSessionData) {
          const adminSession = JSON.parse(adminSessionData);
          if (adminSession.isAuthenticated && new Date().getTime() < adminSession.expiresAt) {
            const adminUser: User = {
              id: `admin-${adminSession.username}`,
              name: adminSession.username,
              email: `${adminSession.username}@blkout.community`,
              role: 'admin',
              permissions: [
                'moderate_content',
                'manage_curators', 
                'view_analytics',
                'manage_extensions',
                'train_ivor'
              ]
            };
            setUser(adminUser);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem('liberation_admin_session');
          }
        }

        // Fallback to old token system for backwards compatibility
        const token = localStorage.getItem('blkout_admin_token');
        if (token) {
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('blkout_admin_token');
        localStorage.removeItem('liberation_admin_session');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (usernameOrEmail: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Validate credentials
      if (!usernameOrEmail || !password) {
        throw new Error('Username/email and password are required');
      }

      const VALID_PASSWORD = 'blkOUT2025!';
      const VALID_USERNAMES = ['admin', 'moderator'];

      // Check if it's a username login (admin/moderator)
      if (VALID_USERNAMES.includes(usernameOrEmail.toLowerCase())) {
        if (password !== VALID_PASSWORD) {
          throw new Error('Invalid password. Please check your credentials.');
        }

        const adminUser: User = {
          id: `admin-${usernameOrEmail}`,
          name: usernameOrEmail,
          email: `${usernameOrEmail}@blkout.community`,
          role: 'admin',
          permissions: [
            'moderate_content',
            'manage_curators',
            'view_analytics', 
            'manage_extensions',
            'train_ivor'
          ]
        };

        // Create session compatible with AdminAuth
        const session = {
          isAuthenticated: true,
          expiresAt: new Date().getTime() + (8 * 60 * 60 * 1000), // 8 hours
          role: usernameOrEmail.toLowerCase() === 'admin' ? 'admin' : 'moderator',
          username: usernameOrEmail
        };

        localStorage.setItem('liberation_admin_session', JSON.stringify(session));
        setUser(adminUser);
        return;
      }

      // Fallback to email-based authentication for backwards compatibility
      if (password !== VALID_PASSWORD) {
        throw new Error('Invalid password. Please check your credentials.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usernameOrEmail)) {
        throw new Error('Please enter a valid username (admin/moderator) or email address.');
      }

      const adminUser: User = {
        id: `admin-${Date.now()}`,
        name: usernameOrEmail.split('@')[0].replace(/[._-]/g, ' ').trim(),
        email: usernameOrEmail.toLowerCase(),
        role: 'admin',
        permissions: [
          'moderate_content',
          'manage_curators',
          'view_analytics',
          'manage_extensions', 
          'train_ivor'
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      const token = `blkout_token_${Date.now()}_${btoa(usernameOrEmail)}`;
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
    localStorage.removeItem('liberation_admin_session');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isCurator = user?.role === 'curator' || isAdmin;

  const value: AuthContextType = {
    user,
    isAdmin,
    isCurator,
    signIn,
    signOut,
    loading,
    error
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};;;

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