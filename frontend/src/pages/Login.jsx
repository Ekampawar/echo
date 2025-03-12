import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { useAuth } from '../context/AuthContext'; // Import useAuth hook for accessing auth context
import '../styles/Form.css'; // Import the CSS file for styling the login page

const Login = () => {
  const { login, error, loading, userData } = useAuth(); // Destructure login, error, and loading from context
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [localError, setLocalError] = useState(''); // State for local error handling
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (userData) {
      navigate('/dashboard'); // Redirect to the dashboard page if user is already logged in
    }
  }, [userData, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); // Reset local error state

    // Basic form validation
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    // Simple email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    try {
      await login(email, password); // Call login function from AuthContext
      console.log('Login successful');
      
      // Redirect to the dashboard after a successful login
      navigate('/dashboard'); // This will redirect the user to the dashboard page

    } catch (err) {
      console.error('Login failed:', err);
      setLocalError('Failed to login. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-wrapper">
        <h2 className="form-title">Login</h2>

        {/* Display error message if any */}
        {(localError || error) && (
          <div className="error-message">
            {localError || error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="form-button"
          disabled={loading || !email || !password}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>

        <div className="form-link">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
          <p><a href="/forgot-password">Forgot Password?</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
