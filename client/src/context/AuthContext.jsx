import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('projecthub_jwt') || null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('projecthub_jwt');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setCurrentUser(res.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('projecthub_jwt');
            setCurrentUser(null);
            setToken(null);
          }
        } catch (err) {
          console.warn('Session restoration failed:', err);
          localStorage.removeItem('projecthub_jwt');
          setCurrentUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    if (res.data.success) {
      const { token: jwtToken, user } = res.data;
      localStorage.setItem('projecthub_jwt', jwtToken);
      setToken(jwtToken);
      setCurrentUser(user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: jwtToken, user } = res.data;
      localStorage.setItem('projecthub_jwt', jwtToken);
      setToken(jwtToken);
      setCurrentUser(user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('projecthub_jwt');
    setToken(null);
    setCurrentUser(null);
  };

  const updateProfileState = (updatedUser) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
