import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfileModal from "./EditProfileModal";
import "./Dashboard.css";

function VolunteerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showEditModal, setShowEditModal] = useState(false);
  const [opportunities, setOpportunities] = useState([]);

  // Fetch all opportunities for browsing
  useEffect(() => {
    fetch("http://localhost:8080/api/opportunities/all")
      .then((r) => r.json())
      .then((data) => setOpportunities(data.filter((o) => o.status?.toUpperCase() !== "CLOSED")))
      .catch(() => { });
  }, []);

  const handleAddSkills = () => {
    // For now, just show the edit profile modal where they can edit skills
    setShowEditModal(true);
  };

  return (
    <div className="volunteer-dashboard">
      <Navbar />
      <div className="volunteer-dashboard-container">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="volunteer-sidebar">
          
          {/* User Profile Section */}
          <div className="volunteer-profile-section">
            <div className="profile-header">
              <h2>{user?.fullName || "Volunteer"}</h2>
              <p className="profile-role">Volunteer</p>
            </div>
            <button className="volunteer-edit-btn" onClick={() => setShowEditModal(true)}>
              Edit Profile
            </button>
          </div>

          {/* Your Skills Section */}
          <div className="sidebar-section">
            <h3>YOUR SKILLS</h3>
            {!user?.skills || user.skills.trim() === "" ? (
              <div className="no-skills">
                <p>No skills added yet</p>
                <button className="add-skills-btn" onClick={handleAddSkills}>
                  + Add Skills
                </button>
              </div>
            ) : (
              <div className="skills-list">
                {user.skills.split(",").map((skill, index) => (
                  <span key={index} className="skill-tag">{skill.trim()}</span>
                ))}
                <button className="add-skills-btn" onClick={handleAddSkills}>
                  + Add Skills
                </button>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className="sidebar-section">
            <h3>ACTIVITY</h3>
            <p className="no-activity">No recent activity</p>
          </div>

        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="volunteer-main-content">
          
          <div className="opportunities-content">
            {/* Find Opportunities Header */}
            <div className="opportunities-header">
              <h2>Find Opportunities</h2>
              <p className="opportunities-subtitle">
                Discover volunteering opportunities that match your skills and interests.
              </p>
              <button className="browse-all-btn" onClick={() => navigate("/opportunities")}>
                Browse All Opportunities
              </button>
            </div>

            {/* Opportunities List */}
            <div className="opportunities-section">
              {opportunities.length === 0 ? (
                <p className="no-opportunities">No opportunities available at the moment. Check back soon!</p>
              ) : (
                <div className="opportunities-list">
                  {opportunities.map((opp) => (
                    <div className="opportunity-card" key={opp.id}>
                      <div className="opportunity-header">
                        <div className="opportunity-title-section">
                          <h3 className="opportunity-title">{opp.title}</h3>
                          <span className="opportunity-status open">Open</span>
                        </div>
                        <p className="opportunity-ngo">NGO ID: {opp.ngo?.id || "N/A"}</p>
                      </div>
                      
                      <p className="opportunity-description">{opp.description}</p>
                      
                      {opp.requiredSkills && (
                        <div className="opportunity-skills">
                          {opp.requiredSkills.split(",").map((skill, index) => (
                            <span key={index} className="opportunity-skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <button className="view-details-btn">
                        View details →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>

      </div>

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
