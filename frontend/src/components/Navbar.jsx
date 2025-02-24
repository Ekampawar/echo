import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // Path to your logo image
import "../styles/Navbar.css"; // Import the CSS file

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="link-container">
                <Link to="/Home">Home</Link>
                <Link to="/blogs">Blogs</Link>
                <Link to="/About">About</Link>

                {!user ? (
                    <>
                        <Link to="/Signup">Signup</Link>
                        <Link to="/Login">Login</Link>
                    </>
                ) : (
                    <>
                        <Link to="/UserDashboard">Dashboard</Link>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
