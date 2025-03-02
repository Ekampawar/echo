import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

// Create the AuthContext to provide authentication state globally
export const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for token in localStorage when the app initializes
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
      return;
    }

    setLoading(true);
    axiosInstance
      .get('/auth/user', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setError('Session expired or token invalid. Please log in again.');
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, []); // useEffect now runs only once on mount

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
