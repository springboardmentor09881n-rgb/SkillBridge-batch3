import React, { useState } from "react";

const CreateOpportunityModal = ({ onClose, onOpportunityCreated, editingOpp }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = React.useState({
        title: editingOpp?.title || "",
        description: editingOpp?.description || "",
        duration: editingOpp?.duration || "",
        location: editingOpp?.location || "",
        status: editingOpp?.status || "Open"
    });

    const [skillInput, setSkillInput] = React.useState("");
    const [skills, setSkills] = React.useState(editingOpp?.skillsRequired || []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillInput.trim() !== "") {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let finalSkills = [...skills];
            if (skillInput.trim() !== "") {
                finalSkills.push(skillInput.trim());
                setSkillInput(""); // Clear the input visually
            }

            const opportunityData = {
                ...formData,
                skillsRequired: finalSkills,
                organizationId: user.id
            };

            const url = editingOpp
                ? `http://localhost:5000/api/opportunities/${editingOpp._id}`
                : "http://localhost:5000/api/opportunities";

            const method = editingOpp ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(opportunityData)
            });

            if (response.ok) {
                if (onOpportunityCreated) {
                    onOpportunityCreated();
                } else {
                    onClose();
                }
            } else {
                const errorData = await response.json();
                console.error("Error saving opportunity:", errorData);
                alert("Failed to save opportunity. Please try again.");
            }
        } catch (error) {
            console.error("Error saving opportunity:", error);
            alert("Network error. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this opportunity?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/opportunities/${editingOpp._id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                if (onOpportunityCreated) {
                    onOpportunityCreated();
                }
            } else {
                alert("Failed to delete opportunity.");
            }
        } catch (error) {
            console.error(error);
            alert("Network error while deleting.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">

                {/* Sticky Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{editingOpp ? "Edit Opportunity" : "Create New Opportunity"}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Website Redesign"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Provide details about the opportunity"
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Required Skills */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Required Skills</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="e.g. Web Development"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill(e);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="bg-[#1890ff] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                >
                                    Add
                                </button>
                            </div>
                            {/* Display added skills tags */}
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(index)}
                                                className="text-white hover:text-gray-200"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Duration and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g. 2-3 weeks, Ongoing"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. New York, NY, Remote"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    required
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white cursor-pointer"
                                >
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Draft">Draft</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-6" />

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-2">
                            <div>
                                {editingOpp && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm px-4 py-2 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        Delete
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#1890ff] hover:bg-blue-600 transition-colors shadow-sm"
                                >
                                    {editingOpp ? "Save Changes" : "Create"}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOpportunityModal;
