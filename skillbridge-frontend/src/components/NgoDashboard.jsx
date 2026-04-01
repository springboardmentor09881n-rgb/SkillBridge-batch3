import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfileModal from "./EditProfileModal";
import OpportunityFormModal from "./OpportunityFormModal";
import { IconEdit, IconClipboard, IconMapPin, IconClock, IconPlus } from "./Icons";
import "./Dashboard.css";

function NgoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [opportunities, setOpportunities] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [oppModal, setOppModal] = useState(null);

  // Fetch this NGO's opportunities
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/opportunities/ngo/${user.id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load opportunities");
        return r.json();
      })
      .then((opps) => {
        setOpportunities(opps);
        opps.forEach((opp) => {
          fetch(`http://localhost:8080/api/applications/opportunity/${opp.id}`, { credentials: "include" })
            .then((r) => (r.ok ? r.json() : []))
            .then((apps) => {
              setAppCounts((prev) => ({
                ...prev,
                [opp.id]: {
                  total: apps.length,
                  pending: apps.filter((a) => (a.status || "PENDING").toUpperCase() === "PENDING").length,
                },
              }));
            })
            .catch(() => {});
        });
      })
      .catch(console.error);
  }, [user?.id]);

  const handleOppSaved = (saved, isEdit) => {
    if (isEdit) {
      setOpportunities((prev) => prev.map((o) => (o.id === saved.id ? saved : o)));
    } else {
      setOpportunities((prev) => [...prev, saved]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opportunity?")) return;
    await fetch(`http://localhost:8080/api/opportunities/${id}`, { method: "DELETE", credentials: "include" });
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  // Stats
  const openCount = opportunities.filter((o) => o.status?.toUpperCase() !== "CLOSED").length;
  const totalApps = Object.values(appCounts).reduce((sum, c) => sum + c.total, 0);
  const pendingApps = Object.values(appCounts).reduce((sum, c) => sum + c.pending, 0);

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main two-col">

        {/* ── LEFT: Organization Profile ── */}
        <section className="dash-profile-card">
          <h3>Organization Profile</h3>
          <div className="dash-profile-grid">
            <div className="dash-detail">
              <span className="dash-detail-label">Organization Name</span>
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

          {/* Quick Stats */}
          <div className="dash-stats">
            <div className="dash-stat">
              <span className="dash-stat-value">{openCount}</span>
              <span className="dash-stat-label">Open Roles</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat-value">{totalApps}</span>
              <span className="dash-stat-label">Applications</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat-value">{pendingApps}</span>
              <span className="dash-stat-label">Pending</span>
            </div>
          </div>

          <button className="dash-edit-btn" onClick={() => setShowEditModal(true)}>
            <IconEdit size={14} style={{ marginRight: 5 }} /> Edit Profile
          </button>
        </section>

        {/* ── RIGHT: Opportunities ── */}
        <div className="dash-right-column">
          <section className="dash-section">
            <div className="dash-section-header">
              <h3>Your Opportunities</h3>
              <button className="btn-primary" onClick={() => setOppModal("create")}>
                <IconPlus size={14} style={{ marginRight: 4 }} /> Create Opportunity
              </button>
            </div>

            {opportunities.length === 0 ? (
              <div className="dash-empty-state">
                <span className="dash-empty-icon"><IconClipboard size={36} /></span>
                <p>No opportunities yet. Create your first one!</p>
              </div>
            ) : (
              <div className="opp-list">
                {opportunities.map((opp) => {
                  const counts = appCounts[opp.id];
                  return (
                    <div className="opp-card" key={opp.id}>
                      <div className="opp-card-top">
                        <span className="opp-title">{opp.title}</span>
                        <span className={`opp-status ${opp.status?.toLowerCase() === "open" ? "open" : "closed"}`}>
                          {opp.status || "Open"}
                        </span>
                      </div>

                      {opp.description && <p className="opp-desc">{opp.description}</p>}

                      {opp.requiredSkills && (
                        <div className="opp-meta">
                          {opp.requiredSkills.split(",").map((s) => (
                            <span className="opp-tag" key={s.trim()}>{s.trim()}</span>
                          ))}
                        </div>
                      )}

                      <div className="opp-info">
                        {opp.location && <span><IconMapPin size={14} style={{ marginRight: 3 }} /> {opp.location}</span>}
                        {opp.duration && <span><IconClock size={14} style={{ marginRight: 3 }} /> {opp.duration}</span>}
                      </div>

                      <div className="opp-card-actions">
                        <button
                          className="btn-view-apps"
                          onClick={() => navigate(`/opportunity/${opp.id}/applications`)}
                        >
                          <IconClipboard size={14} style={{ marginRight: 4 }} /> View Applications
                          {counts?.total > 0 && (
                            <span className="app-count-badge">{counts.total}</span>
                          )}
                        </button>
                        <button className="btn-edit-opp" onClick={() => setOppModal(opp)}>Edit</button>
                        <button className="btn-delete-opp" onClick={() => handleDelete(opp.id)}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

      </main>

      {/* ── Modals ── */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => setUser(updated)}
        />
      )}

      {oppModal && (
        <OpportunityFormModal
          ngoId={user?.id}
          opportunity={oppModal === "create" ? null : oppModal}
          onClose={() => setOppModal(null)}
          onSaved={handleOppSaved}
        />
      )}
    </div>
  );
}

export default NgoDashboard;
