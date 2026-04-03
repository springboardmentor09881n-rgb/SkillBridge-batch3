import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateOpportunityModal from "./CreateOpportunityModal";

const OrganizationDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || (!user.id && !user._id)) return;
      const userId = user.id || user._id;
      try {
        setLoading(true);
        // Fetch opportunities
        const oppRes = await fetch(`http://localhost:5000/api/opportunities/ngo/${userId}`);
        if (oppRes.ok) {
          const oppData = await oppRes.json();
          setOpportunities(oppData);
        }

        // Fetch applications
        const appRes = await fetch(`http://localhost:5000/api/applications/organization/${userId}`);
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, user?._id]);

  const activeOpportunitiesCount = opportunities.filter(opp => opp.status === "Open" || opp.status === "active").length;
  const applicationsCount = applications.length;
  const activeVolunteersCount = new Set(applications.map(app => app.volunteerId?._id)).size;
  const pendingApplicationsCount = applications.filter(app => app.status === "Pending").length;

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
            <span className="text-black border-b-2 border-black pb-1 cursor-pointer">Dashboard</span>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/OrganizationDashboard/Opportunities')}>Opportunities</span>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/OrganizationDashboard/Applications')}>Applications</span>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/OrganizationMessages')}>Messages</span>
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
              <li className="bg-gray-100 text-black px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Dashboard
              </li>
              <li onClick={() => navigate('/OrganizationDashboard/Opportunities')} className="hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                Opportunities
              </li>
              <li onClick={() => navigate('/OrganizationDashboard/Applications')} className="hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Applications
              </li>
              <li onClick={() => navigate('/OrganizationMessages')} className="hover:bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-6">

          {/* Overview Cards */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-[#f0f7ff] p-5 rounded-lg border border-blue-50">
                <p className="text-2xl font-black text-gray-900">{loading ? '-' : activeOpportunitiesCount}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Active Opportunities</p>
              </div>
              <div className="bg-[#f0fdf4] p-5 rounded-lg border border-green-50">
                <p className="text-2xl font-black text-gray-900">{loading ? '-' : applicationsCount}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Applications</p>
              </div>
              <div className="bg-[#f5f3ff] p-5 rounded-lg border border-purple-50">
                <p className="text-2xl font-black text-purple-600">{loading ? '-' : activeVolunteersCount}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Active Volunteers</p>
              </div>
              <div className="bg-[#fefce8] p-5 rounded-lg border border-yellow-50">
                <p className="text-2xl font-black text-gray-900">{loading ? '-' : pendingApplicationsCount}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Pending Applications</p>
              </div>
            </div>
          </section>

          {/* Recent Applications */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-gray-900">Recent Applications</h3>
              <button className="text-xs font-medium border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                View All
              </button>
            </div>

            {/* Real Application Cards */}
            {loading ? (
              <p className="text-sm text-gray-500 bg-[#f8fafc] p-4 rounded-md">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="text-sm text-gray-500 bg-[#f8fafc] p-4 rounded-md">No applications received yet.</p>
            ) : (
              applications.slice(0, 5).map(app => (
                <div key={app._id} className="border border-gray-100 rounded-lg p-5 mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{app.volunteerId?.fullName || "Volunteer"}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Applied for: {app.opportunityId?.title || "Unknown Opportunity"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.volunteerId?.email}</p>
                    </div>
                    <span className={`px-3 py-1 bg-white border border-gray-200 text-xs font-semibold rounded-full capitalize ${app.status === 'Accepted' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'}`}>
                      {app.status}
                    </span>
                  </div>
                  {/* Additional info can be added here if present in application schema */}
                </div>
              ))
            )}
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Create Opportunity Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center py-8 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm hover:bg-gray-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center mb-3 group-hover:border-gray-400 transition-colors">
                  <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="font-semibold text-gray-800 text-sm">Create New Opportunity</span>
              </button>

              {/* View Messages Button */}
              <button onClick={() => navigate('/OrganizationMessages')} className="flex flex-col items-center justify-center py-8 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm hover:bg-gray-50 transition-all group">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <span className="font-semibold text-gray-800 text-sm">View Messages</span>
              </button>

            </div>
          </section>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && <CreateOpportunityModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default OrganizationDashboard;