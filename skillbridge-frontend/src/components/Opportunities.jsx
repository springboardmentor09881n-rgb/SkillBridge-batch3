import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ApplicationFormModal from "./ApplicationFormModal";
import OpportunityDetailModal from "./OpportunityDetailModal";
import { IconBuilding, IconMapPin, IconClock, IconExternalLink } from "./Icons";
import "./Dashboard.css";
import "./Opportunities.css";

function Opportunities() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [skill, setSkill] = useState("");
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState("");
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [selectedOpp, setSelectedOpp] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [fetchError, setFetchError] = useState("");
    const [detailOpp, setDetailOpp] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (skill.trim()) params.set("skill", skill.trim());
        if (location.trim()) params.set("location", location.trim());
        if (duration.trim()) params.set("duration", duration.trim());

        setLoading(true);
        setFetchError("");
        fetch(`http://localhost:8080/api/opportunities/filter?${params.toString()}`, { credentials: "include" })
            .then(async (r) => {
                if (!r.ok) {
                    throw new Error(r.status === 401 || r.status === 403 ? "Please login again to view opportunities." : "Could not load opportunities.");
                }
                return r.json();
            })
            .then((data) => { setOpportunities(data); setLoading(false); })
            .catch((err) => {
                setOpportunities([]);
                setFetchError(err.message || "Could not load opportunities.");
                setLoading(false);
            });
    }, [search, skill, location, duration]);

    useEffect(() => {
        if (!user?.id || user?.role?.toUpperCase() !== "VOLUNTEER") return;
        fetch(`http://localhost:8080/api/applications/volunteer/${user.id}`, { credentials: "include" })
            .then(async (r) => {
                if (!r.ok) return [];
                return r.json();
            })
            .then((apps) => {
                const ids = new Set(apps.map((app) => app?.opportunity?.id).filter(Boolean));
                setAppliedIds(ids);
            })
            .catch(() => { });
    }, [user?.id, user?.role]);

    const resetFilters = () => {
        setSearch("");
        setSkill("");
        setLocation("");
        setDuration("");
    };

    const handleSubmitApplication = async (formData) => {
        if (!selectedOpp || !user?.id) return;

        setSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("http://localhost:8080/api/applications/submit", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    volunteerId: user.id,
                    opportunityId: selectedOpp.id,
                    motivation: formData.motivation,
                    availability: formData.availability,
                    contactNote: formData.contactNote,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Could not submit application");
            }

            setAppliedIds((prev) => {
                const next = new Set(prev);
                next.add(selectedOpp.id);
                return next;
            });
            setSelectedOpp(null);
            setSubmitSuccess(data.message || "Application submitted successfully");
            setTimeout(() => setSubmitSuccess(""), 3000);
        } catch (error) {
            setSubmitError(error.message || "Could not submit application");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="opp-page-main">
                <div className="opp-page-header">
                    <div>
                        <h2 className="opp-page-title">Volunteer Opportunities</h2>
                        <p className="opp-page-sub">Find the right cause to contribute your skills to</p>
                    </div>
                </div>

                <div className="opp-filters">
                    <input
                        className="opp-search"
                        placeholder="Search title, skill, NGO, description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        className="opp-search"
                        placeholder="Filter by skill"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                    />
                    <input
                        className="opp-search"
                        placeholder="Filter by location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <input
                        className="opp-search"
                        placeholder="Filter by duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                    <button className="opp-reset-btn" onClick={resetFilters}>Reset</button>
                </div>

                {submitSuccess && <p className="opp-success">{submitSuccess}</p>}

                {loading ? (
                    <p className="opp-empty">Loading…</p>
                ) : fetchError ? (
                    <p className="opp-empty">{fetchError}</p>
                ) : opportunities.length === 0 ? (
                    <p className="opp-empty">
                        {search || skill || location || duration
                            ? "No opportunities match your current filters."
                            : "No opportunities posted yet. Check back soon!"}
                    </p>
                ) : (
                    <div className="opp-page-grid">
                        {opportunities.map((opp) => (
                            <div className="opp-page-card" key={opp.id}>
                                <div className="opp-card-top">
                                    <span className="opp-title">{opp.title}</span>
                                    <span className={`opp-status ${opp.status?.toLowerCase() === "open" ? "open" : "closed"}`}>
                                        {opp.status || "Open"}
                                    </span>
                                </div>

                                {opp.ngo?.fullName && (
                                    <p className="opp-org"><IconBuilding size={14} style={{ marginRight: 4 }} /> {opp.ngo.fullName}</p>
                                )}

                                {opp.description && (
                                    <p className="opp-desc">{opp.description}</p>
                                )}

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

                                <div className="opp-actions">
                                    <button
                                        className="opp-details-btn"
                                        onClick={() => setDetailOpp(opp)}
                                    >
                                        <IconExternalLink size={14} style={{ marginRight: 4 }} /> Details
                                    </button>
                                    {user?.role?.toUpperCase() === "VOLUNTEER" && (
                                        <button
                                            className={`opp-apply-btn ${appliedIds.has(opp.id) ? "applied" : ""}`}
                                            onClick={() => {
                                                setSubmitError("");
                                                setSelectedOpp(opp);
                                            }}
                                            disabled={appliedIds.has(opp.id)}
                                        >
                                            {appliedIds.has(opp.id) ? "Applied" : "Apply"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {detailOpp && (
                <OpportunityDetailModal
                    opportunity={detailOpp}
                    onClose={() => setDetailOpp(null)}
                    hasApplied={appliedIds.has(detailOpp.id)}
                    onApply={(opp) => {
                        setDetailOpp(null);
                        setSubmitError("");
                        setSelectedOpp(opp);
                    }}
                />
            )}

            {selectedOpp && (
                <ApplicationFormModal
                    opportunity={selectedOpp}
                    onClose={() => {
                        setSelectedOpp(null);
                        setSubmitError("");
                    }}
                    onSubmit={handleSubmitApplication}
                    loading={submitting}
                    error={submitError}
                />
            )}
        </div>
    );
}

export default Opportunities;
