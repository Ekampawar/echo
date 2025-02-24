import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials.email, credentials.password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required />
            <input type="password" placeholder="Password" onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;