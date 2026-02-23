import React from "react";
import { useLocation } from "react-router-dom";

const VolunteerDashboard = () => {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  // Helper function to get initials for the avatar (e.g., "Test Volunteer" -> "TV")
  const getInitials = (name) => {
    if (!name) return "V";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800">
      {/* TOP NAVIGATION */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-12">
          <h1 className="text-xl font-extrabold tracking-tight text-black">
            SkillBridge
          </h1>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <span className="text-black border-b-2 border-black pb-1 cursor-pointer">
              Dashboard
            </span>
            <span className="hover:text-black cursor-pointer transition-colors">
              Opportunities
            </span>
            <span className="hover:text-black cursor-pointer transition-colors">
              Messages
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-700 capitalize">
            {user?.userType || "Volunteer"}
          </span>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-8 flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full md:w-[300px] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* User Profile Info */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl border border-gray-200">
                {getInitials(user?.fullName || "Test Volunteer")}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg leading-tight">
                  {user?.fullName || "Test Volunteer"}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {user?.userType || "Volunteer"}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Your Skills
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">No skills added yet</p>
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-full transition-colors">
                  + Add Skills
                </button>
              </div>
            </div>

            {/* Activity Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Activity
              </h3>
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Find Opportunities Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Find Opportunities
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                Discover volunteering opportunities that match your skills and
                interests.
              </p>
              <button className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Browse All Opportunities
              </button>
            </div>

            {/* Opportunity List */}
            <div className="flex flex-col">
              {/* Item 1 */}
              <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Website Redesign for Local Shelter
                  </h3>
                  <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">NGO ID: 2</p>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Help us redesign our website to improve our online presence
                  and reach more potential adopters.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    Web Development
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    UI/UX Design
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1 transition-colors">
                  View details <span className="text-lg leading-none">›</span>
                </button>
              </div>

              {/* Item 2 */}
              <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Translation of Educational Materials
                  </h3>
                  <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">NGO ID: 2</p>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Translate educational materials from English to Spanish,
                  French, or Arabic to support our global literacy programs.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    Translation
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    Language Skills
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1 transition-colors">
                  View details <span className="text-lg leading-none">›</span>
                </button>
              </div>

              {/* Item 3 */}
              <div className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Fundraising Gala Event Coordinator
                  </h3>
                  <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">NGO ID: 2</p>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Help plan and coordinate our annual fundraising gala to
                  support children's medical research.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    Event Planning
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    Marketing
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1 transition-colors">
                  View details <span className="text-lg leading-none">›</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
