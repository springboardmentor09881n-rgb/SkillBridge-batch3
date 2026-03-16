import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrganizationApplications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/applications/organization/${user.id}`
      );

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
  }, [user?.id]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update application status.");
      }

      const updatedApplication = await response.json();
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? updatedApplication : app))
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      alert(error.message || "Could not update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMessage = (application) => {
    const email = application.volunteerId?.email;
    if (!email) {
      alert("Volunteer email not available.");
      return;
    }

    const volunteerName = application.volunteerId?.fullName || "Volunteer";
    const opportunityTitle = application.opportunityId?.title || "your application";
    const subject = encodeURIComponent(`Regarding your application: ${opportunityTitle}`);
    const body = encodeURIComponent(
      `Hi ${volunteerName},\n\nThank you for applying for ${opportunityTitle}.\n\nRegards,\n${user?.organizationName || "Organization"}`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const filteredApplications = applications.filter((application) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const volunteerName = application.volunteerId?.fullName?.toLowerCase() || "";
    const volunteerEmail = application.volunteerId?.email?.toLowerCase() || "";
    const opportunityTitle = application.opportunityId?.title?.toLowerCase() || "";

    const matchesSearch =
      normalizedSearch.length === 0 ||
      volunteerName.includes(normalizedSearch) ||
      volunteerEmail.includes(normalizedSearch) ||
      opportunityTitle.includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-12">
          <h1 className="text-xl font-extrabold tracking-tight text-black">SkillBridge</h1>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/OrganizationDashboard')}>Dashboard</span>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/OrganizationDashboard/Opportunities')}>Opportunities</span>
            <span className="text-black border-b-2 border-black pb-1 cursor-pointer">Applications</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
            <p className="text-sm text-gray-500 mt-1">All volunteer applications for your opportunities</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by volunteer, email, or opportunity"
              className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-sm text-gray-500">No applications found yet.</div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application._id} className="border border-gray-100 rounded-lg p-5">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {application.volunteerId?.fullName || "Volunteer"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {application.volunteerId?.email || "No email"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Opportunity: {application.opportunityId?.title || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 border text-xs font-semibold rounded-full ${
                        application.status === "Accepted"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : application.status === "Rejected"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Applied on {new Date(application.dateApplied).toLocaleDateString()}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusUpdate(application._id, "Accepted")}
                      disabled={updatingId === application._id || application.status === "Accepted"}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(application._id, "Rejected")}
                      disabled={updatingId === application._id || application.status === "Rejected"}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleMessage(application)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrganizationApplications;