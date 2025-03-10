import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loading

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            // Make the signup request using axiosInstance
            const response = await axiosInstance.post("/auth/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // On success, navigate to the login page or directly login
            navigate("/login");

        } catch (error) {
            // Handle error and show message to the user
            if (error.response) {
                // Check for specific errors from the server
                if (error.response.data.message.includes("Username")) {
                    setError("This username is already taken.");
                } else if (error.response.data.message.includes("Email")) {
                    setError("This email is already registered.");
                } else {
                    setError(error.response.data.message || "An error occurred during signup.");
                }
            } else {
                setError("An error occurred during signup.");
            }
        } finally {
            setIsLoading(false);  // End loading
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
            <form onSubmit={handleSubmit} className="form-wrapper">
                <h2 className="form-title">Signup</h2>

                {/* Display error message if any */}
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
        </div>
    );
};

export default Signup;