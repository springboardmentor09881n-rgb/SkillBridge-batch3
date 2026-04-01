import { useState } from "react";
import { IconX } from "./Icons";
import "./EditProfileModal.css";

function ApplicationFormModal({ opportunity, onClose, onSubmit, loading, error }) {
    const [form, setForm] = useState({
        motivation: "",
        availability: "",
        contactNote: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Apply for {opportunity?.title}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close"><IconX size={18} /></button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label>Why are you a good fit? *</label>
                        <textarea
                            name="motivation"
                            rows={4}
                            value={form.motivation}
                            onChange={handleChange}
                            placeholder="Share your motivation and relevant experience"
                            required
                        />
                    </div>

                    <div className="modal-field-row">
                        <div className="modal-field">
                            <label>Availability</label>
                            <input
                                name="availability"
                                value={form.availability}
                                onChange={handleChange}
                                placeholder="e.g. Weekends, 6 hrs/week"
                            />
                        </div>
                        <div className="modal-field">
                            <label>Contact Note</label>
                            <input
                                name="contactNote"
                                value={form.contactNote}
                                onChange={handleChange}
                                placeholder="Preferred contact details"
                            />
                        </div>
                    </div>

                    {error && <p className="modal-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationFormModal;
