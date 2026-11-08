
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                TeamSphere<span>.</span>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <a href="#features">Features</a>
                <Link to="/login">Login</Link>
                <Link to="/register" className="nav-button">
                    Get Started
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
