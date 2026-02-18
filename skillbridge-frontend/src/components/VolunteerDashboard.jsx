import Navbar from "./Navbar";
import "./Dashboard.css";

function VolunteerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">
        <section className="dash-profile-card">
          <h3>Your Profile</h3>
          <div className="dash-profile-grid">
            <div className="dash-detail">
              <span className="dash-detail-label">Full Name</span>
              <span className="dash-detail-value">{user?.fullName || "—"}</span>
            </div>
            <div className="dash-detail">
              <span className="dash-detail-label">Username</span>
              <span className="dash-detail-value">{user?.username || "—"}</span>
            </div>
            <div className="dash-detail">
              <span className="dash-detail-label">Email</span>
              <span className="dash-detail-value">{user?.email || "—"}</span>
            </div>
            <div className="dash-detail">
              <span className="dash-detail-label">Skills</span>
              <span className="dash-detail-value">{user?.skills || "Not specified"}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default VolunteerDashboard;
