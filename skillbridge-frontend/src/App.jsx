import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import NgoDashboard from "./components/NgoDashboard";
import VolunteerDashboard from "./components/VolunteerDashboard";
import Opportunities from "./components/Opportunities";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ngo-dashboard" element={<NgoDashboard />} />
      <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      <Route path="/opportunities" element={<Opportunities />} />
    </Routes>
  );
}

export default App;
