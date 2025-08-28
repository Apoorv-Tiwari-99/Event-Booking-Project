import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('authToken');
    const storedUser = authService.getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
      
      // Verify token is still valid
      authService.getProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          authService.logout();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => { // Remove isAdmin parameter
    try {
      setError('');
      setLoading(true);
      
      const response = await authService.login({ 
        email, 
        password // Only send email and password
      });
      
      const { token, user: userData } = response;
      
      // Store auth data
      authService.storeAuthData(token, userData);
      setUser(userData);
      
      return userData;
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await authService.register(userData);
      const { token, user: newUser } = response;
      
      // Store auth data
      authService.storeAuthData(token, newUser);
      setUser(newUser);
      
      return newUser;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call the logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API success/failure
      setUser(null);
      setError('');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};