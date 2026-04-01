import { useState, useEffect } from "react";
import { IconX } from "./Icons";
import "./EditProfileModal.css";

function OpportunityFormModal({ ngoId, opportunity, onClose, onSaved }) {
    const isEdit = Boolean(opportunity);
    const [form, setForm] = useState({
        title: opportunity?.title || "",
        description: opportunity?.description || "",
        requiredSkills: opportunity?.requiredSkills || "",
        location: opportunity?.location || "",
        duration: opportunity?.duration || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Title is required."); return; }
        setLoading(true);
        setError("");
        try {
            const url = isEdit
                ? `http://localhost:8080/api/opportunities/${opportunity.id}`
                : `http://localhost:8080/api/opportunities/create/${ngoId}`;
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed");
            const saved = await res.json();
            onSaved(saved, isEdit);
            onClose();
        } catch {
            setError("Could not save opportunity. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEdit ? "Edit Opportunity" : "Create Opportunity"}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close"><IconX size={18} /></button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label>Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Digital Marketing Volunteer" />
                    </div>

                    <div className="modal-field">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the role and responsibilities…"
                        />
                    </div>

                    <div className="modal-field">
                        <label>Required Skills <span className="modal-hint">(comma-separated)</span></label>
                        <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="e.g. design, communication" />
                    </div>

                    <div className="modal-field-row">
                        <div className="modal-field">
                            <label>Location</label>
                            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote / Pune" />
                        </div>
                        <div className="modal-field">
                            <label>Duration</label>
                            <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" />
                        </div>
                    </div>

                    {error && <p className="modal-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? "Saving…" : isEdit ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OpportunityFormModal;
