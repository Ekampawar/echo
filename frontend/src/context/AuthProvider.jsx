import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { api } from "../utils/axiosInstance"; // Import API functions
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data on mount if token is available (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.getCurrentUser(); // Use API to get current user
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        localStorage.removeItem("token"); // Remove token if invalid
        setError("Failed to fetch user data. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.login(email, password); // Use API to login
      localStorage.setItem("token", response.data.token); // Save token in localStorage
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (username, email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.signup(username, email, password); // Use API to signup
      localStorage.setItem("token", response.data.token); // Save token in localStorage
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;