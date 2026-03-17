import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateOpportunityModal from "./CreateOpportunityModal";
import ViewOpportunityModal from "./ViewOpportunityModal";
const OrganizationOpportunities = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOpp, setEditingOpp] = useState(null);
    const [viewingOpp, setViewingOpp] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    // Calculate counts
    const totalCount = opportunities.length;
    const openCount = opportunities.filter(opp => opp.status === "Open" || opp.status === "active").length;
    const closedCount = opportunities.filter(opp => opp.status === "Closed" || opp.status === "closed").length;

    // Filter opportunities for display
    const filteredOpportunities = opportunities.filter(opp => {
        if (activeFilter === "Open") return opp.status === "Open" || opp.status === "active";
        if (activeFilter === "Closed") return opp.status === "Closed" || opp.status === "closed";
        return true; // "All"
    });

    // Sample static data based on screenshot
    const fetchOpportunities = async () => {
        if (!user || !user.id) return;
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/opportunities/ngo/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setOpportunities(data);
            }
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800">
            {/* TOP NAVIGATION */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-12">
                    <h1 className="text-xl font-extrabold tracking-tight text-black">SkillBridge</h1>
                    <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
                        <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate("/OrganizationDashboard")}>Dashboard</span>
                        <span className="text-black border-b-2 border-black pb-1 cursor-pointer">Opportunities</span>
                        <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate("/OrganizationDashboard/Applications")}>Applications</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Messages</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full capitalize">
                        {user?.userType || "Ngo"}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto p-8 pt-10">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Opportunities</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your volunteering opportunities</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingOpp(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-[#1890ff] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Create New Opportunity
                    </button>
                </div>

                {/* Filters & Tabs */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setActiveFilter("All")}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === "All" ? "bg-white text-gray-800 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            All ({totalCount})
                        </button>
                        <button
                            onClick={() => setActiveFilter("Open")}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === "Open" ? "bg-white text-gray-800 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Open ({openCount})
                        </button>
                        <button
                            onClick={() => setActiveFilter("Closed")}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === "Closed" ? "bg-white text-gray-800 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Closed ({closedCount})
                        </button>
                    </div>
                    <div>
                        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option>All Opportunities</option>
                        </select>
                    </div>
                </div>

                {/* Opportunities List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading opportunities...</div>
                    ) : filteredOpportunities.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
                            {activeFilter === "All"
                                ? "No opportunities created yet. Click \"Create New Opportunity\" to get started!"
                                : `No ${activeFilter.toLowerCase()} opportunities found.`
                            }
                        </div>
                    ) : (
                        filteredOpportunities.map((opp) => (
                            <div key={opp._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{opp.title}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Created: {new Date(opp.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="px-4 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                                        {opp.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 my-4 leading-relaxed whitespace-pre-line">
                                    {opp.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {opp.skillsRequired && opp.skillsRequired.map(skill => (
                                        <span key={skill} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium border border-blue-600">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center text-xs text-gray-500 gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {opp.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {opp.duration}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <button onClick={() => setViewingOpp(opp)} className="text-sm font-medium text-gray-700 hover:text-black hover:underline flex items-center gap-1">
                                        View details
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    <button onClick={() => { setEditingOpp(opp); setIsModalOpen(true); }} className="px-4 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <CreateOpportunityModal
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingOpp(null);
                    }}
                    onOpportunityCreated={() => {
                        setIsModalOpen(false);
                        setEditingOpp(null);
                        fetchOpportunities();
                    }}
                    editingOpp={editingOpp}
                />
            )}

            {viewingOpp && (
                <ViewOpportunityModal
                    opportunity={viewingOpp}
                    onClose={() => setViewingOpp(null)}
                />
            )}
        </div>
    );
};

export default OrganizationOpportunities;
