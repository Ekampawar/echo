import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook for accessing auth context
import '../styles/Form.css'; // Import the CSS file for styling the login page

const Login = () => {
  const { login, error, loading } = useAuth(); // Destructure login, error, and loading from context
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [localError, setLocalError] = useState(''); // State for local error handling

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); // Reset local error state

    try {
      await login(email, password); // Call login function from AuthContext
      console.log('Login successful'); // Log successful login
    } catch (err) {
      console.error('Login failed:', err); // Log error
      setLocalError('Failed to login. Please check your credentials and try again.'); // Set local error message
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-wrapper">
        <h2 className="form-title">Login</h2>

        {/* Display error message if any */}
        {localError && <div className="error-message">{localError}</div>}
        {error && <div className="error-message">{error}</div>}

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
          />
        </div>

        <button type="submit" className="form-button" disabled={loading || !email || !password}>
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
