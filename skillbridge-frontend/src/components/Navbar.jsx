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

    return (
        <nav className="navbar">
            <div className="navbar-accent"></div>
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate("/")}>
                    <span className="brand-text">SkillBridge</span>
                </div>

                <div className="navbar-center">
                    {user && (
                        <>
                            <span
                                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                                onClick={() => navigate("/")}
                            >
                                Home
                            </span>
                            <span
                                className={`nav-link ${location.pathname.includes("dashboard") ? "active" : ""}`}
                                onClick={() => navigate(dashboardPath)}
                            >
                                Dashboard
                            </span>
                        </>
                    )}
                </div>

                <div className="navbar-right">
                    {user && (
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
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
