import { useNavigate } from "react-router-dom";
import { IconX, IconBuilding, IconMapPin, IconClock, IconMessageCircle, IconSkill } from "./Icons";
import "./OpportunityDetailModal.css";

function OpportunityDetailModal({ opportunity, onClose, onApply, hasApplied }) {
    const navigate = useNavigate();
    if (!opportunity) return null;

    const skills = opportunity.requiredSkills
        ? opportunity.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    const organizationDisplay =
        opportunity.ngo?.fullName ||
        opportunity.ngo?.organizationName ||
        opportunity.ngo?.username ||
        opportunity.ngo?.email ||
        "Not specified";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="opp-detail-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="opp-detail-header">
                    <div>
                        <h2 className="opp-detail-title">{opportunity.title}</h2>
                        {opportunity.ngo?.fullName && (
                            <p className="opp-detail-org">
                                <IconBuilding size={15} style={{ marginRight: 5 }} />
                                {opportunity.ngo.fullName}
                            </p>
                        )}
                    </div>
                    <div className="opp-detail-header-right">
                        <span className={`opp-status ${opportunity.status?.toLowerCase() === "open" ? "open" : "closed"}`}>
                            {opportunity.status || "Open"}
                        </span>
                        <button className="modal-close" onClick={onClose} aria-label="Close">
                            <IconX size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="opp-detail-body">
                    {/* Meta info */}
                    <div className="opp-detail-meta">
                        {opportunity.location && (
                            <div className="opp-detail-meta-item">
                                <IconMapPin size={16} />
                                <div>
                                    <span className="opp-detail-meta-label">Location</span>
                                    <span className="opp-detail-meta-value">{opportunity.location}</span>
                                </div>
                            </div>
                        )}
                        {opportunity.duration && (
                            <div className="opp-detail-meta-item">
                                <IconClock size={16} />
                                <div>
                                    <span className="opp-detail-meta-label">Duration</span>
                                    <span className="opp-detail-meta-value">{opportunity.duration}</span>
                                </div>
                            </div>
                        )}
                        {opportunity.ngo && (
                            <div className="opp-detail-meta-item">
                                <IconBuilding size={16} />
                                <div>
                                    <span className="opp-detail-meta-label">Organization</span>
                                    <span className="opp-detail-meta-value">{organizationDisplay}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {opportunity.description && (
                        <div className="opp-detail-section">
                            <h4>About This Opportunity</h4>
                            <p>{opportunity.description}</p>
                        </div>
                    )}

                    {/* Required Skills */}
                    {skills.length > 0 && (
                        <div className="opp-detail-section">
                            <h4><IconSkill size={15} style={{ marginRight: 5 }} /> Required Skills</h4>
                            <div className="opp-detail-skills">
                                {skills.map((s) => (
                                    <span className="opp-tag" key={s}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="opp-detail-footer">
                    {opportunity.ngo && (
                        <button
                            className="opp-detail-msg-btn"
                            onClick={() => {
                                onClose();
                                navigate(`/messaging?userId=${opportunity.ngo.id}`);
                            }}
                        >
                            <IconMessageCircle size={15} style={{ marginRight: 5 }} /> Connect with NGO
                        </button>
                    )}
                    <button
                        className={`opp-detail-apply-btn ${hasApplied ? "applied" : ""}`}
                        disabled={hasApplied}
                        onClick={() => {
                            if (!hasApplied) onApply(opportunity);
                        }}
                    >
                        {hasApplied ? "Already Applied" : "Apply Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OpportunityDetailModal;
