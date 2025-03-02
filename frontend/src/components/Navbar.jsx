import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // Ensure logo is in the correct path
import "../styles/Navbar.css"; // Import the CSS file

const Navbar = () => {
    const { user } = useContext(AuthContext); // Removed logout from Navbar

    return (
        <nav className="navbar">
            {/* Logo Section */}
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="link-container">
                <Link to="/">Home</Link>
                <Link to="/blogs">Blogs</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact Us</Link>

                {!user ? (
                    <>
                        <Link to="/signup">Signup</Link>
                        <Link to="/login">Login</Link>
                    </>
                ) : (
                    <>
                        <Link to="/user-dashboard">Dashboard</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
