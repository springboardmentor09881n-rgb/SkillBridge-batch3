import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrganizationApplications = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    // Calculate counts for filters
    const totalCount = applications.length;
    const pendingCount = applications.filter(app => app.status === "Pending").length;
    const acceptedCount = applications.filter(app => app.status === "Accepted").length;
    const rejectedCount = applications.filter(app => app.status === "Rejected").length;

    // Filter applications for display
    const filteredApplications = applications.filter(app => {
        if (activeFilter !== "All") return app.status === activeFilter;
        return true;
    });

    const fetchApplications = async () => {
        if (!user || (!user.id && !user._id)) return;
        const userId = user.id || user._id;
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/applications/organization/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [user?.id, user?._id]);

    const handleApplicationUpdate = async (appId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${appId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchApplications();
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800">
            {/* TOP NAVIGATION */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-12">
                    <h1 className="text-xl font-extrabold tracking-tight text-black">SkillBridge</h1>
                    <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
                        <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate("/OrganizationDashboard")}>Dashboard</span>
                        <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate("/OrganizationDashboard/Opportunities")}>Opportunities</span>
                        <span className="text-black border-b-2 border-black pb-1 cursor-pointer">Applications</span>
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

            <div className="max-w-[1400px] mx-auto p-8 flex flex-col md:flex-row gap-8">
                {/* SIDEBAR */}
                <aside className="w-full md:w-[280px] shrink-0 flex flex-col gap-6">
                    {/* Org Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                            {user?.organizationName || "HopeForAll Foundation"}
                        </h2>
                        <p className="text-sm text-gray-500 capitalize">{user?.userType || "Ngo"}</p>
                    </div>

                    {/* Navigation Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-4">
                        <ul className="space-y-1 text-sm font-medium text-gray-600 px-3">
                            <li onClick={() => navigate('/OrganizationDashboard')} className="hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Dashboard
                            </li>
                            <li onClick={() => navigate('/OrganizationDashboard/Opportunities')} className="hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                Opportunities
                            </li>
                            <li className="bg-gray-100 text-black px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Applications
                            </li>
                            <li className="hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                Messages
                            </li>
                        </ul>
                        <div className="mt-8 px-7 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Organization Info
                        </div>

                        {/* Logout Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100 px-3">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 space-y-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Applications</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage applications received from volunteers</p>
                        </div>
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
                                onClick={() => setActiveFilter("Pending")}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === "Pending" ? "bg-white text-gray-800 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Pending ({pendingCount})
                            </button>
                            <button
                                onClick={() => setActiveFilter("Accepted")}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === "Accepted" ? "bg-white text-gray-800 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Accepted ({acceptedCount})
                            </button>
                            <button
                                onClick={() => setActiveFilter("Rejected")}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === "Rejected" ? "bg-white text-gray-800 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Rejected ({rejectedCount})
                            </button>
                        </div>
                    </div>

                    {/* Applications List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading applications...</div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
                                {activeFilter === "All"
                                    ? "No applications received yet."
                                    : `No ${activeFilter.toLowerCase()} applications found.`
                                }
                            </div>
                        ) : (
                            filteredApplications.map((app) => (
                                <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{app.volunteerId?.fullName || "Volunteer"}</h3>
                                            <p className="text-sm text-gray-500 mt-1 font-medium">{app.opportunityId?.title || "Unknown Opportunity"}</p>
                                            <p className="text-xs text-gray-400 mt-1">{app.volunteerId?.email}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-4 py-1.5 bg-white border border-gray-200 text-xs font-bold rounded-full capitalize ${app.status === 'Accepted' ? 'text-green-600 border-green-200 bg-green-50' : app.status === 'Rejected' ? 'text-red-600 border-red-200 bg-red-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'}`}>
                                                {app.status}
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Applied: {new Date(app.dateApplied || app.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-5 border-t border-gray-100 flex gap-3">
                                        {app.status === "Pending" && (
                                            <>
                                                <button 
                                                    onClick={() => handleApplicationUpdate(app._id, "Accepted")}
                                                    className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow-sm hover:shadow transition-all"
                                                >
                                                    Accept Applicant
                                                </button>
                                                <button 
                                                    onClick={() => handleApplicationUpdate(app._id, "Rejected")}
                                                    className="px-5 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}
                                        <button className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors ml-auto flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Message
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrganizationApplications;
