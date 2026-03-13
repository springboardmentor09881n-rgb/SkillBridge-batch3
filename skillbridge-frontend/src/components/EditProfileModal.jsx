import { useState } from "react";
import "./EditProfileModal.css";

function EditProfileModal({ user, onClose, onSave }) {
    const role = (user?.role || "").toLowerCase();
    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        username: user?.username || "",
        skills: user?.skills || "",
        location: user?.location || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            setError("Could not identify user profile. Please login again.");
            return;
        }
        if (!form.fullName.trim() || !form.username.trim()) {
            setError("Full name and username are required.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to save");
            const updated = await res.json();
            // Merge updated fields back into stored user
            const merged = { ...user, ...updated };
            localStorage.setItem("user", JSON.stringify(merged));
            onSave(merged);
            onClose();
        } catch {
            setError("Could not save changes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label>Full Name</label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="modal-field">
                        <label>Username</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                    </div>

                    <div className="modal-field">
                        <label>Location</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. Pune, Maharashtra"
                        />
                    </div>

                    {role === "volunteer" && (
                        <div className="modal-field">
                            <label>Skills <span className="modal-hint">(comma-separated)</span></label>
                            <input
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="e.g. graphic design, content writing"
                            />
                        </div>
                    )}

                    {error && <p className="modal-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
