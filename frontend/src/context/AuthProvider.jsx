import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { axiosInstance, api } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);  // State to hold user data
  const [loading, setLoading] = useState(true);  // State to show loading indicator
  const navigate = useNavigate();  // useNavigate hook for navigation

  useEffect(() => {
    // We don't need to check for authentication for public pages (Home, Blogs)
    const token = localStorage.getItem('token');
    if (token) {
      api.getCurrentUser()
        .then((response) => {
          setUserData(response.data.user);  // Set user data if the token is valid
          setLoading(false);  // Stop loading
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');  // Clear invalid token if error occurs
          setLoading(false);
        });
    } else {
      setLoading(false);  // Stop loading if no token found
    }
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);  // Store token in localStorage
      setUserData(response.data.user);  // Set user data in context
      navigate('/home');  // Navigate to home page
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', response.data.token);  // Store token in localStorage
      setUserData(response.data.user);  // Set user data in context
      navigate('/home');  // Navigate to home page
    } catch (error) {
      console.error('Failed to signup:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setUserData(null);  // Clear user data
    navigate('/login');  // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user: userData, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;