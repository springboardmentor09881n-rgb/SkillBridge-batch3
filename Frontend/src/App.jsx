import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Form from "./components/form/Form";
import Login from "./components/login/Login";
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard";
import VolunteerOpportunities from "./components/dashboard/VolunteerOpportunities";
import OrganizationDashboard from "./components/dashboard/OrganizationDashboard";
import OrganizationOpportunities from "./components/dashboard/OrganizationOpportunities";
import OrganizationApplications from "./components/dashboard/OrganizationApplications";
import Messages from "./components/dashboard/Messages";

// Import your new ProtectedRoute!
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Form />} />

        {/* Protect the Organization Dashboard */}
        <Route
          path="/OrganizationDashboard"
          element={
            <ProtectedRoute allowedRole="organization">
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/OrganizationDashboard/Opportunities"
          element={
            <ProtectedRoute allowedRole="organization">
              <OrganizationOpportunities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/OrganizationDashboard/Applications"
          element={
            <ProtectedRoute allowedRole="organization">
              <OrganizationApplications />
            </ProtectedRoute>
          }
        />

        {/* Protect the Volunteer Dashboard */}
        <Route
          path="/VolunteerDashboard"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/VolunteerDashboard/Opportunities"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerOpportunities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Messages"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/OrganizationMessages"
          element={
            <ProtectedRoute allowedRole="organization">
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
