import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import EditProfileModal from "./EditProfileModal";
import OpportunityFormModal from "./OpportunityFormModal";
import "./Dashboard.css";

function NgoDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [opportunities, setOpportunities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [oppModal, setOppModal] = useState(null); // null | "create" | opportunity obj

  // ── Fetch this NGO's opportunities on mount ──
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/opportunities/ngo/${user.id}`)
      .then((r) => r.json())
      .then(setOpportunities)
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
    await fetch(`http://localhost:8080/api/opportunities/${id}`, { method: "DELETE" });
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main two-col">

        {/* ── Organization Profile Card ── */}
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
          <button className="dash-edit-btn" onClick={() => setShowEditModal(true)}>
            ✏️ Edit Profile
          </button>
        </section>

        {/* ── Opportunities Section ── */}
        <section className="dash-section">
          <div className="dash-section-header">
            <h3>Your Opportunities</h3>
            <button className="btn-primary" onClick={() => setOppModal("create")}>
              + Create Opportunity
            </button>
          </div>

          {opportunities.length === 0 ? (
            <p className="opp-empty">No opportunities yet. Create your first one!</p>
          ) : (
            <div className="opp-list">
              {opportunities.map((opp) => (
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
                    {opp.location && <span>📍 {opp.location}</span>}
                    {opp.duration && <span>🕒 {opp.duration}</span>}
                  </div>

                  <div className="opp-card-actions">
                    <button className="btn-edit-opp" onClick={() => setOppModal(opp)}>Edit</button>
                    <button className="btn-delete-opp" onClick={() => handleDelete(opp.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
