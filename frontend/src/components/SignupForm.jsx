import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const [userData, setUserData] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/auth/signup", userData);
            navigate("/login");
        } catch (error) {
            console.error("Signup failed:", error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={(e) => setUserData({ ...userData, username: e.target.value })} required />
            <input type="email" placeholder="Email" onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
            <input type="password" placeholder="Password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupForm;