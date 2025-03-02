import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";  // Import the custom axios instance
import "../styles/Form.css";

const SignupForm = () => {
    const [userData, setUserData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState(null);  // For storing error message
    const [isLoading, setIsLoading] = useState(false);  // For loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loading

        try {
            // Using axiosInstance to make the API request
            await axiosInstance.post("/auth/register", userData);
            navigate("/login");
        } catch (error) {
            // Handle error and show message to the user
            setError(error.response?.data?.message || "An error occurred during signup.");
        } finally {
            setIsLoading(false);  // End loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-wrapper">
            <h2 className="form-title">Sign Up</h2>

            {/* Display error message if any */}
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                    type="text"
                    id="username"
                    className="form-input"
                    placeholder="Enter your username"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="form-link">
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </form>
    );
};

export default SignupForm;
