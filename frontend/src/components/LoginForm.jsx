import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";  // Import the custom axios instance
import "../styles/Form.css";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);  // For storing error message
    const [isLoading, setIsLoading] = useState(false);  // For loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loading

        try {
            // Make the login request using axiosInstance
            const response = await axiosInstance.post("/auth/login", credentials);
            
            // Store the token in localStorage (you can add more logic like storing user data here)
            localStorage.setItem("token", response.data.token);

            // Fetch the user's role
            const roleResponse = await axiosInstance.get("/auth/user-role", {
                headers: {
                    Authorization: `Bearer ${response.data.token}`
                }
            });

            // Redirect to the appropriate dashboard based on the user's role
            if (roleResponse.data.role === 'admin') {
                navigate("/admin-dashboard");
            } else {
                navigate("/user-dashboard");
            }
        } catch (error) {
            // Handle error and show message to the user
            setError(error.response?.data?.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);  // End loading
        }
    };

    return (
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
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? "Logging In..." : "Login"}
            </button>

            <div className="form-link">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
                <p className="forgot-password-link">
                    <a href="/forgot-password">Forgot Password?</a>
                </p>
            </div>
        </form>
    );
};

export default LoginForm;
