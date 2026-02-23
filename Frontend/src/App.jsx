import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Form from "./components/form/Form";
import Login from "./components/login/Login";
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard";
import OrganizationDashboard from "./components/dashboard/OrganizationDashboard";

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

        {/* Protect the Volunteer Dashboard */}
        <Route
          path="/VolunteerDashboard"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
