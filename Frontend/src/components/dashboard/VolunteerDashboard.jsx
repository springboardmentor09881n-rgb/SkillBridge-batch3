import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Star } from "lucide-react";
import ViewOpportunityModal from "./ViewOpportunityModal";

const VolunteerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const [opportunities, setOpportunities] = useState([]);
  const [matchedOpportunities, setMatchedOpportunities] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOpp, setViewingOpp] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Open");

  const fetchOpportunities = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const response = await fetch("http://localhost:5000/api/opportunities");
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
      
      // Fetch matches
      if (user && (user.id || user._id)) {
        const matchRes = await fetch(`http://localhost:5000/api/opportunities/matches/${user.id || user._id}`);
        if (matchRes.ok) {
          const matchData = await matchRes.json();
          setMatchedOpportunities(matchData.slice(0, 3)); // Show top 3 matches
        }
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const fetchApplications = async (isBackground = false) => {
    if (!user || (!user.id && !user._id)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/applications/volunteer/${user._id || user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Show newest first
        setMyApplications(data.reverse());
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchApplications();

    // Poll for new opportunities every 10 seconds
    const intervalId = setInterval(() => {
      fetchOpportunities(true);
      fetchApplications(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

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
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/VolunteerDashboard/Opportunities')}>
              Opportunities
            </span>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/Messages')}>
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
              <div className="space-y-3">
                {myApplications && myApplications.filter(app => app.status !== "Pending").length > 0 ? (
                  myApplications
                    .filter(app => app.status !== "Pending")
                    .slice(0, 5) // Display the 5 most recent activity messages
                    .map(app => (
                    <div key={app._id} className={`p-3 rounded-lg text-sm border shadow-sm ${app.status === 'Accepted' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <p className="font-semibold flex items-center justify-between mb-1">
                        Application {app.status}
                        {app.status === 'Accepted' ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed">
                        Your application for <span className="font-semibold text-gray-900 px-1 py-0.5 bg-white/50 rounded inline-block shadow-sm">"{app.opportunityId?.title || "an opportunity"}"</span> has been {app.status.toLowerCase()}.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No recent activity</p>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col gap-8">
          
          {/* MATCHES PANEL */}
          {!loading && matchedOpportunities.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-blue-100/50 flex justify-between items-center bg-white/50">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Top Match Suggestions
                  </h2>
                  <p className="text-sm text-blue-700/80 mt-1">Based on your skills & location</p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchedOpportunities.map((match) => (
                  <div key={match._id} className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2" title={match.title}>{match.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        {match.matchScore} pts
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[80px]" title={match.location}>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{match.duration}</span>
                      </div>
                    </div>
                    
                    {match.matchedSkills && match.matchedSkills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">Matched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills.map(skill => (
                            <span key={skill} className="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded-full capitalize">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setViewingOpp(match)}
                      className="w-full mt-auto py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold text-xs rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Find Opportunities Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Volunteering Opportunities
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Find opportunities that match your skills and interests
              </p>

              {/* Filters */}
              <div className="p-5 border border-gray-200 rounded-xl mb-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-800">Filter Opportunities</span>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSkillFilter("");
                      setLocationFilter("");
                      setDurationFilter("");
                      setStatusFilter("Open");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors border border-red-100 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Reset Filters
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Skills Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search skills..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Web Development", "Translation", "Marketing"].map(skill => (
                        <button
                          key={skill}
                          onClick={() => setSkillFilter(skill)}
                          className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search locations..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["New York", "Remote", "Chicago"].map(loc => (
                        <button
                          key={loc}
                          onClick={() => setLocationFilter(loc)}
                          className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="relative">
                      <select
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="All">All Statuses</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunity List */}
            <div className="flex flex-col">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading opportunities...</div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white">
                  No opportunities available right now.
                </div>
              ) : (
                opportunities.filter(opp => {
                  const matchesSearch = !searchQuery || opp.title.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesSkill = !skillFilter || (opp.skillsRequired && opp.skillsRequired.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
                  const matchesLocation = !locationFilter || (opp.location && opp.location.toLowerCase().includes(locationFilter.toLowerCase()));
                  const matchesDuration = !durationFilter || (opp.duration && opp.duration.toString().toLowerCase().includes(durationFilter.toLowerCase()));
                  const matchesStatus = statusFilter === "All" || !opp.status || (opp.status && opp.status.toLowerCase() === statusFilter.toLowerCase());
                  return matchesSearch && matchesSkill && matchesLocation && matchesDuration && matchesStatus;
                }).length === 0 ? (
                  <div className="text-center py-10 text-gray-500 bg-white">
                    No matching opportunities found.
                  </div>
                ) : (
                  opportunities.filter(opp => {
                    const matchesSearch = !searchQuery || opp.title.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesSkill = !skillFilter || (opp.skillsRequired && opp.skillsRequired.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
                    const matchesLocation = !locationFilter || (opp.location && opp.location.toLowerCase().includes(locationFilter.toLowerCase()));
                    const matchesDuration = !durationFilter || (opp.duration && opp.duration.toString().toLowerCase().includes(durationFilter.toLowerCase()));
                    const matchesStatus = statusFilter === "All" || !opp.status || (opp.status && opp.status.toLowerCase() === statusFilter.toLowerCase());
                    return matchesSearch && matchesSkill && matchesLocation && matchesDuration && matchesStatus;
                  }).map((opp) => (
                    <div key={opp._id} className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {opp.title}
                        </h3>
                        <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded-full">
                          {opp.status}
                        </span>
                      </div>
                      {/* Assuming ngo info is desired, currently we don't have ngo name, fallback to ID */}
                      <p className="text-sm text-gray-500 mb-4">NGO ID: {opp.organizationId}</p>
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                        {opp.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {opp.skillsRequired && opp.skillsRequired.map((skill) => (
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
                      <button
                        onClick={() => setViewingOpp(opp)}
                        className="text-sm text-gray-600 hover:text-black font-medium flex items-center gap-1 transition-colors"
                      >
                        View details <span className="text-lg leading-none">›</span>
                      </button>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </main>
      </div>

      {viewingOpp && (
        <ViewOpportunityModal
          opportunity={viewingOpp}
          onClose={() => setViewingOpp(null)}
        />
      )}
    </div>
  );
};

export default VolunteerDashboard;
