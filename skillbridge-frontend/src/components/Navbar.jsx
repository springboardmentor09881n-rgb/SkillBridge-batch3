import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const dashboardPath = user?.role === "ngo" ? "/ngo-dashboard" : "/volunteer-dashboard";

    const isActive = (path) => location.pathname === path;
    const isDashboard = location.pathname.includes("dashboard");

    return (
        <nav className="navbar">
            <div className="navbar-accent"></div>
            <div className="navbar-container">

                {/* Brand — left */}
                <div className="navbar-brand" onClick={() => navigate("/")}>
                    <span className="brand-icon">🌉</span>
                    <span className="brand-text">SkillBridge</span>
                </div>

                {/* Nav links — centre */}
                {user && (
                    <div className="navbar-center">
                        <span
                            className={`nav-link ${isActive("/home") ? "active" : ""}`}
                            onClick={() => navigate("/home")}
                        >
                            Home
                        </span>
                        <span
                            className={`nav-link ${isDashboard ? "active" : ""}`}
                            onClick={() => navigate(dashboardPath)}
                        >
                            Dashboard
                        </span>
                        {/* Volunteers see Opportunities, NGOs manage within dashboard */}
                        {user.role !== "ngo" && (
                            <span
                                className={`nav-link ${isActive("/opportunities") ? "active" : ""}`}
                                onClick={() => navigate("/opportunities")}
                            >
                                Opportunities
                            </span>
                        )}
                    </div>
                )}

                {/* User info / auth buttons — right */}
                <div className="navbar-right">
                    {user ? (
                        <>
                            <div className="user-avatar">
                                {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                            </div>
                            <span className="navbar-user">
                                {user.fullName || user.username}
                            </span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="nav-signin-btn" onClick={() => navigate("/login")}>
                                Sign In
                            </button>
                            <button className="nav-getstarted-btn" onClick={() => navigate("/signup")}>
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
