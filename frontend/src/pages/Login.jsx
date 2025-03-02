import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook for accessing auth context

const Login = () => {
  const { login, error, loading } = useAuth(); // Destructure login, error, and loading from context
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password); // Call login function from AuthContext
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-wrapper">
        <h2 className="form-title">Login</h2>

        {/* Display error message if any */}
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
