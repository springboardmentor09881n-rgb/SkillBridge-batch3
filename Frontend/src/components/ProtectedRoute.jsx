import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // 1. If they aren't logged in at all, kick them back to the login page
  if (!token || !userString) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userString);

  // 2. Normalize the role just in case (to handle 'ngo' vs 'organization')
  const actualRole = user.userType === "ngo" ? "organization" : user.userType;

  // 3. If they are logged in but trying to view the WRONG dashboard, send them to their correct one
  if (allowedRole && actualRole !== allowedRole) {
    if (actualRole === "organization") {
      return <Navigate to="/OrganizationDashboard" replace />;
    } else {
      return <Navigate to="/VolunteerDashboard" replace />;
    }
  }

  // 4. If they pass all checks, render the component!
  return children;
};

export default ProtectedRoute;
