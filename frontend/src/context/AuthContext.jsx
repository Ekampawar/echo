import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("/api/auth/user", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setUser(response.data))
                .catch(() => localStorage.removeItem("token"));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
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