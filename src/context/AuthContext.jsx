import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ct_pos_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ct_pos_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validate session token on app mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ct_pos_token');
      if (savedToken) {
        const res = await getMeApi(savedToken);
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('ct_pos_user', JSON.stringify(res.user));
        } else {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('ct_pos_token', jwtToken);
    localStorage.setItem('ct_pos_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ct_pos_token');
    localStorage.removeItem('ct_pos_user');
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
