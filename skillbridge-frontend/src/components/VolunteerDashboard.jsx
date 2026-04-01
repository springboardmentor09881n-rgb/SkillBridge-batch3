import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfileModal from "./EditProfileModal";
import MatchSuggestions from "./MatchSuggestions";
import { IconEdit, IconFileText, IconBuilding, IconMessageCircle, IconPlus, IconTarget } from "./Icons";
import "./Dashboard.css";

function VolunteerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showEditModal, setShowEditModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [activeTab, setActiveTab] = useState("matches");

  // Fetch volunteer's applications
  useEffect(() => {
    if (!user?.id) return;
    setLoadingApps(true);
    fetch(`http://localhost:8080/api/applications/volunteer/${user.id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoadingApps(false));
  }, [user?.id]);

  const handleAddSkills = () => {
    setShowEditModal(true);
  };

  const getStatusClass = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "accepted" || s === "approved") return "accepted";
    if (s === "rejected") return "rejected";
    return "pending";
  };

  const pendingCount = applications.filter(a => (a.status || "PENDING").toUpperCase() === "PENDING").length;
  const acceptedCount = applications.filter(
    (a) => ["ACCEPTED", "APPROVED"].includes((a.status || "").toUpperCase())
  ).length;
  const profileInitial = (user?.fullName || user?.username || "V").trim().charAt(0).toUpperCase();

  return (
    <div className="dashboard-page volunteer-dashboard-page">
      <Navbar />
      <main className="dashboard-main two-col">

        {/* ── LEFT: Profile Sidebar ── */}
        <section className="dash-profile-card">
          <div className="vol-profile-hero">
            <span className="vol-profile-avatar">{profileInitial}</span>
            <div className="vol-profile-heading">
              <p className="vol-profile-name">{user?.fullName || "Volunteer"}</p>
              <p className="vol-profile-subtitle">Volunteer Account</p>
            </div>
          </div>
          <h3>Volunteer Profile</h3>
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
              <span className="dash-detail-label">Location</span>
              <span className="dash-detail-value">{user?.location || "Not specified"}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="dash-skills-section">
            <span className="dash-detail-label">Your Skills</span>
            {!user?.skills || user.skills.trim() === "" ? (
              <div className="no-skills">
                <p>No skills added yet</p>
                <button className="add-skills-btn" onClick={handleAddSkills}>
                  <IconPlus size={14} style={{ marginRight: 4 }} /> Add Skills
                </button>
              </div>
            ) : (
              <div className="skills-list">
                {user.skills.split(",").map((skill, index) => (
                  <span key={index} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            )}
          </div>

          <button className="dash-edit-btn" onClick={() => setShowEditModal(true)}>
            <IconEdit size={14} style={{ marginRight: 5 }} /> Edit Profile
          </button>
        </section>

        {/* ── RIGHT: Tabbed Panel ── */}
        <div className="dash-tabbed-panel">
          <div className="vol-dashboard-summary" aria-label="Application summary">
            <div className="vol-summary-item">
              <span>Total</span>
              <strong>{applications.length}</strong>
            </div>
            <div className="vol-summary-item">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div className="vol-summary-item">
              <span>Accepted</span>
              <strong>{acceptedCount}</strong>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="dash-tabs">
            <button
              className={`dash-tab ${activeTab === "matches" ? "active" : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              <IconTarget size={14} style={{ marginRight: 5 }} />
              Matched Opportunities
            </button>
            <button
              className={`dash-tab ${activeTab === "applications" ? "active" : ""}`}
              onClick={() => setActiveTab("applications")}
            >
              <IconFileText size={14} style={{ marginRight: 5 }} />
              My Applications
              {pendingCount > 0 && <span className="dash-tab-badge">{pendingCount}</span>}
            </button>
          </div>

          {/* Tab content */}
          <div className="dash-tab-content">
            {activeTab === "matches" && (
              <MatchSuggestions userId={user?.id} />
            )}

            {activeTab === "applications" && (
              <div className="dash-tab-inner">
                {loadingApps ? (
                  <p className="opp-empty">Loading applications…</p>
                ) : applications.length === 0 ? (
                  <div className="dash-empty-state">
                    <span className="dash-empty-icon"><IconFileText size={32} /></span>
                    <p>No applications yet</p>
                    <button className="match-browse-btn" onClick={() => navigate("/opportunities")}>
                      Browse Opportunities
                    </button>
                  </div>
                ) : (
                  <div className="app-list">
                    {applications.map((app) => (
                      <div className="app-card" key={app.id}>
                        <div className="app-card-top">
                          <div>
                            <p className="app-opportunity">{app.opportunity?.title || "Opportunity"}</p>
                            {app.opportunity?.ngo?.fullName && (
                              <p className="app-volunteer"><IconBuilding size={13} style={{ marginRight: 4 }} /> {app.opportunity.ngo.fullName}</p>
                            )}
                          </div>
                          <span className={`app-status ${getStatusClass(app.status)}`}>
                            {app.status || "PENDING"}
                          </span>
                        </div>
                        {app.motivation && (
                          <p className="app-detail"><strong>Motivation:</strong> {app.motivation}</p>
                        )}
                        {app.status?.toUpperCase() === "ACCEPTED" && app.opportunity?.ngo && (
                          <button
                            className="match-msg-btn"
                            style={{ marginTop: "6px" }}
                            onClick={() => navigate(`/messaging?userId=${app.opportunity.ngo.id}`)}
                          >
                            <IconMessageCircle size={13} style={{ marginRight: 4 }} /> Message Organization
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => setUser(updated)}
        />
      )}
    </div>
  );
}

export default VolunteerDashboard;
