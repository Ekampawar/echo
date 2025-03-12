import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Assuming you have the useAuth hook

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children;  // If authenticated, render the protected component
};

export default PrivateRoute;
