import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { updateApplicationStatus } from "../services/api";
import { IconArrowLeft, IconMapPin, IconClock, IconMail, IconClipboard, IconCheck, IconX, IconMessageCircle, IconInbox } from "./Icons";
import "./Dashboard.css";
import "./OpportunityApplications.css";

function OpportunityApplications() {
    const { opportunityId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const [opportunity, setOpportunity] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingAppId, setUpdatingAppId] = useState(null);

    useEffect(() => {
        if (!opportunityId) return;
        setLoading(true);

        Promise.all([
            fetch(`http://localhost:8080/api/opportunities/all`, { credentials: "include" })
                .then((r) => r.json())
                .then((all) => all.find((o) => o.id === Number(opportunityId))),
            fetch(`http://localhost:8080/api/applications/opportunity/${opportunityId}`, { credentials: "include" })
                .then((r) => {
                    if (!r.ok) return [];
                    return r.json();
                }),
        ])
            .then(([opp, apps]) => {
                setOpportunity(opp || null);
                setApplications(apps || []);
            })
            .catch(() => {
                setOpportunity(null);
                setApplications([]);
            })
            .finally(() => setLoading(false));
    }, [opportunityId]);

    const handleUpdateStatus = async (appId, status) => {
        setUpdatingAppId(appId);
        try {
            const updated = await updateApplicationStatus(appId, status);
            setApplications((prev) =>
                prev.map((a) => (a.id === appId ? { ...a, status: updated.status || status } : a))
            );
        } catch {
            // ignore
        } finally {
            setUpdatingAppId(null);
        }
    };

    const getStatusClass = (status) => {
        const s = (status || "pending").toLowerCase();
        if (s === "accepted" || s === "approved") return "accepted";
        if (s === "rejected") return "rejected";
        return "pending";
    };

    // Stats
    const pendingCount = applications.filter((a) => (a.status || "PENDING").toUpperCase() === "PENDING").length;
    const acceptedCount = applications.filter((a) => ["ACCEPTED", "APPROVED"].includes((a.status || "").toUpperCase())).length;
    const rejectedCount = applications.filter((a) => (a.status || "").toUpperCase() === "REJECTED").length;

    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="opp-apps-page">
                {/* Back button + Header */}
                <div className="opp-apps-header">
                    <button className="opp-apps-back" onClick={() => navigate("/ngo-dashboard")}>
                        <IconArrowLeft size={16} style={{ marginRight: 4 }} /> Back to Dashboard
                    </button>

                    {loading ? (
                        <h2>Loading…</h2>
                    ) : !opportunity ? (
                        <h2>Opportunity not found</h2>
                    ) : (
                        <>
                            <div className="opp-apps-title-row">
                                <div>
                                    <h2>{opportunity.title}</h2>
                                    {opportunity.description && (
                                        <p className="opp-apps-desc">{opportunity.description}</p>
                                    )}
                                </div>
                                <span className={`opp-status ${opportunity.status?.toLowerCase() === "open" ? "open" : "closed"}`}>
                                    {opportunity.status || "Open"}
                                </span>
                            </div>

                            {/* Quick info */}
                            <div className="opp-apps-meta">
                                {opportunity.requiredSkills && (
                                    <div className="opp-meta">
                                        {opportunity.requiredSkills.split(",").map((s) => (
                                            <span className="opp-tag" key={s.trim()}>{s.trim()}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="opp-info">
                                    {opportunity.location && <span><IconMapPin size={14} style={{ marginRight: 3 }} /> {opportunity.location}</span>}
                                    {opportunity.duration && <span><IconClock size={14} style={{ marginRight: 3 }} /> {opportunity.duration}</span>}
                                </div>
                            </div>

                            {/* Application Stats */}
                            <div className="opp-apps-stats">
                                <div className="opp-apps-stat">
                                    <span className="opp-apps-stat-value total">{applications.length}</span>
                                    <span className="opp-apps-stat-label">Total</span>
                                </div>
                                <div className="opp-apps-stat">
                                    <span className="opp-apps-stat-value pending">{pendingCount}</span>
                                    <span className="opp-apps-stat-label">Pending</span>
                                </div>
                                <div className="opp-apps-stat">
                                    <span className="opp-apps-stat-value accepted">{acceptedCount}</span>
                                    <span className="opp-apps-stat-label">Accepted</span>
                                </div>
                                <div className="opp-apps-stat">
                                    <span className="opp-apps-stat-value rejected">{rejectedCount}</span>
                                    <span className="opp-apps-stat-label">Rejected</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Applications List */}
                {!loading && opportunity && (
                    <div className="opp-apps-list">
                        {applications.length === 0 ? (
                            <div className="dash-empty-state">
                                <span className="dash-empty-icon"><IconInbox size={36} /></span>
                                <p>No applications received for this opportunity yet.</p>
                            </div>
                        ) : (
                            applications.map((app) => {
                                const statusClass = getStatusClass(app.status);
                                const isPending = (app.status || "PENDING").toUpperCase() === "PENDING";
                                return (
                                    <div className="opp-app-card" key={app.id}>
                                        <div className="opp-app-card-header">
                                            <div className="opp-app-applicant">
                                                <div className="opp-app-avatar">
                                                    {(app.volunteer?.fullName || app.volunteer?.username || "V").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4>{app.volunteer?.fullName || app.volunteer?.username || "Volunteer"}</h4>
                                                    {app.volunteer?.email && (
                                                        <p className="opp-app-email"><IconMail size={13} style={{ marginRight: 4 }} /> {app.volunteer.email}</p>
                                                    )}
                                                    {app.volunteer?.location && (
                                                        <p className="opp-app-location"><IconMapPin size={13} style={{ marginRight: 4 }} /> {app.volunteer.location}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`app-status ${statusClass}`}>
                                                {app.status || "PENDING"}
                                            </span>
                                        </div>

                                        {/* Volunteer Skills */}
                                        {app.volunteer?.skills && (
                                            <div className="opp-app-skills">
                                                <span className="opp-app-skills-label">Skills:</span>
                                                <div className="opp-meta">
                                                    {app.volunteer.skills.split(",").map((s) => (
                                                        <span className="opp-tag" key={s.trim()}>{s.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Application details */}
                                        <div className="opp-app-details">
                                            {app.availability && (
                                                <div className="opp-app-detail-item">
                                                    <strong>Availability:</strong> {app.availability}
                                                </div>
                                            )}
                                            {app.motivation && (
                                                <div className="opp-app-detail-item">
                                                    <strong>Motivation:</strong> {app.motivation}
                                                </div>
                                            )}
                                            {app.contactNote && (
                                                <div className="opp-app-detail-item">
                                                    <strong>Contact Note:</strong> {app.contactNote}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="app-actions">
                                            {isPending && (
                                                <>
                                                    <button
                                                        className="app-accept-btn"
                                                        disabled={updatingAppId === app.id}
                                                        onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                                                    >
                                                        {updatingAppId === app.id ? "…" : <><IconCheck size={14} style={{ marginRight: 3 }} /> Accept</>}
                                                    </button>
                                                    <button
                                                        className="app-reject-btn"
                                                        disabled={updatingAppId === app.id}
                                                        onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                                    >
                                                        {updatingAppId === app.id ? "…" : <><IconX size={14} style={{ marginRight: 3 }} /> Reject</>}
                                                    </button>
                                                </>
                                            )}
                                            {app.volunteer && (
                                                <button
                                                    className="match-msg-btn"
                                                    onClick={() => navigate(`/messaging?userId=${app.volunteer.id}`)}
                                                >
                                                    <IconMessageCircle size={14} style={{ marginRight: 4 }} /> Message
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default OpportunityApplications;
