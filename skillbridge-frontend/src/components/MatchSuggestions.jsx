import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchSuggestions } from "../services/api";
import { IconTarget, IconBuilding, IconMapPin, IconClock, IconMessageCircle, IconSearch, IconCheck } from "./Icons";
import "./MatchSuggestions.css";

function MatchSuggestions({ userId }) {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        getMatchSuggestions(userId)
            .then(setMatches)
            .catch(() => setMatches([]))
            .finally(() => setLoading(false));
    }, [userId]);

    const getMatchColor = (pct) => {
        if (pct >= 75) return "#10b981";
        if (pct >= 50) return "#f59e0b";
        return "#6366f1";
    };

    if (loading) {
        return (
            <div className="match-panel">
                <div className="match-panel-header">
                    <h3><IconTarget size={18} style={{ marginRight: 6 }} /> Matched Opportunities</h3>
                </div>
                <div className="match-loading">
                    <div className="match-loading-spinner"></div>
                    <p>Finding your best matches…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="match-panel">
            <div className="match-panel-header">
                <h3><IconTarget size={18} style={{ marginRight: 6 }} /> Matched Opportunities</h3>
                <span className="match-count">{matches.length} found</span>
            </div>

            {matches.length === 0 ? (
                <div className="match-empty">
                    <p className="match-empty-icon"><IconSearch size={36} /></p>
                    <p>No matches yet. Add skills to your profile to get personalized recommendations!</p>
                    <button className="match-browse-btn" onClick={() => navigate("/opportunities")}>
                        Browse All Opportunities
                    </button>
                </div>
            ) : (
                <div className="match-list">
                    {matches.map((match) => (
                        <div className="match-card" key={match.opportunity.id}>
                            <div className="match-card-top">
                                <div className="match-info">
                                    <h4 className="match-title">{match.opportunity.title}</h4>
                                    {match.opportunity.ngo?.fullName && (
                                        <p className="match-org"><IconBuilding size={14} style={{ marginRight: 4 }} /> {match.opportunity.ngo.fullName}</p>
                                    )}
                                </div>
                                <div
                                    className="match-percentage"
                                    style={{ "--match-color": getMatchColor(match.matchPercentage) }}
                                >
                                    <svg className="match-ring" viewBox="0 0 36 36">
                                        <path
                                            className="match-ring-bg"
                                            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="match-ring-fill"
                                            strokeDasharray={`${match.matchPercentage}, 100`}
                                            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <span className="match-pct-text">{match.matchPercentage}%</span>
                                </div>
                            </div>

                            {match.opportunity.description && (
                                <p className="match-desc">{match.opportunity.description}</p>
                            )}

                            <div className="match-tags">
                                {match.matchedSkills.map((skill) => (
                                    <span key={skill} className="match-skill-tag matched">
                                        <IconCheck size={12} style={{ marginRight: 3 }} /> {skill}
                                    </span>
                                ))}
                                {match.locationMatch && (
                                    <span className="match-skill-tag location">
                                        <IconMapPin size={12} style={{ marginRight: 3 }} /> Location match
                                    </span>
                                )}
                            </div>

                            <div className="match-meta">
                                {match.opportunity.location && (
                                    <span><IconMapPin size={14} style={{ marginRight: 3 }} /> {match.opportunity.location}</span>
                                )}
                                {match.opportunity.duration && (
                                    <span><IconClock size={14} style={{ marginRight: 3 }} /> {match.opportunity.duration}</span>
                                )}
                            </div>

                            <div className="match-actions">
                                <button
                                    className="match-apply-btn"
                                    onClick={() => navigate("/opportunities")}
                                >
                                    Apply Now
                                </button>
                                {match.opportunity.ngo && (
                                    <button
                                        className="match-msg-btn"
                                        onClick={() => navigate(`/messaging?userId=${match.opportunity.ngo.id}`)}
                                    >
                                        <IconMessageCircle size={14} style={{ marginRight: 4 }} /> Message NGO
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MatchSuggestions;
