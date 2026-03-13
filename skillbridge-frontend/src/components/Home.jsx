import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const dashPath = user?.role === "ngo" ? "/ngo-dashboard" : "/volunteer-dashboard";

    return (
        <div className="home-page">
            <Navbar />

            <section className="hero">
                <div className="hero-inner">
                    <h1>Find your next<br /><span className="hero-highlight">volunteer opportunity</span></h1>
                    <p className="hero-sub">
                        SkillBridge connects skilled volunteers with NGOs across India.
                        Browse open roles or post one it only takes a minute.
                    </p>
                    <div className="hero-btns">
                        {user ? (
                            <>
                                <button className="btn-primary-hero" onClick={() => navigate(dashPath)}>Go to Dashboard</button>
                                <button className="btn-ghost-hero" onClick={() => navigate("/opportunities")}>Browse Opportunities</button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary-hero" onClick={() => navigate("/signup")}>Get Started</button>
                                <button className="btn-ghost-hero" onClick={() => navigate("/login")}>Sign In</button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
