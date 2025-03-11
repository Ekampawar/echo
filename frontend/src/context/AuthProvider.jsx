import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { axiosInstance, api } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getCurrentUser()
        .then((response) => {
          setUserData(response.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUserData(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to login:', error);
      setError('Failed to login. Please try again.');
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', response.data.token);
      setUserData(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to signup:', error);
      setError('Failed to signup. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user: userData, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;