import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Set up axios instance with a base URL for API requests
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your actual backend API URL
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .get("/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login"); // Redirect to login if token is invalid
        });
    }
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      // Fetch the user's role
      const roleResponse = await axiosInstance.get("/auth/user-role", {
        headers: {
          Authorization: `Bearer ${res.data.token}`
        }
      });

      // Redirect to the appropriate dashboard based on the user's role
      if (roleResponse.data.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
