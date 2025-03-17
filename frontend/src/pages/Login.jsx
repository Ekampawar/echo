import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Form.css";
import ErrorModal from "../components/ErrorModal"; 

const Login = () => {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false); // State to control modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(""); // Reset local error on submit

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      setShowErrorModal(true);
      return;
    }

    try {
      await login(email, password); // Assuming login function handles API call
    } catch (err) {
      setLocalError("Failed to log in. Please check your credentials.");
      setShowErrorModal(true); // Show the error modal
    }
  };

  // Close the error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setLocalError(""); // Clear the error message when modal is closed
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-form-wrapper">
        <h2 className="auth-form-title">Login</h2>

        <div className="auth-form-group">
          <label htmlFor="email" className="auth-form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="auth-form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password" className="auth-form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="auth-form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="auth-form-button" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>

        <div className="auth-form-link">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
          <p>
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </div>
      </form>

      {/* Conditionally render the ErrorModal */}
      {showErrorModal && (
        <ErrorModal message={localError || error} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default Login;
