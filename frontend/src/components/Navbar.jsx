import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
            {user && (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;