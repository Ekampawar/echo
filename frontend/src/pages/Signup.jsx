import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance"; // Import the custom axios instance
import "../styles/Form.css"; // Import the CSS file for styling the signup page

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);  // For storing error message
    const [isLoading, setIsLoading] = useState(false);  // For loading state
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8; // You can add more password strength rules
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Reset error state

        const { username, email, password, confirmPassword } = formData;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            // Make the signup request using axiosInstance
            await axiosInstance.post("/auth/register", {
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
            });

            // On success, navigate to the login page
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during signup.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="auth-form-wrapper">
                <h2 className="auth-form-title">Signup</h2>

                {/* Display error message if any */}
                {error && <div className="error-message">{error}</div>}

                <div className="auth-form-group">
                    <label htmlFor="username" className="auth-form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="auth-form-input"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="email" className="auth-form-label">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="auth-form-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="password" className="auth-form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="auth-form-input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="confirmPassword" className="auth-form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="auth-form-input"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-form-button" 
                    disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
                >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>

                <div className="auth-form-link">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
