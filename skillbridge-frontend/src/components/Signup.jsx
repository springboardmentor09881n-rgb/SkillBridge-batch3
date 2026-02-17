import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false);

  // 👇 ADD THIS PART HERE
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    location: "",
    skills: "",
    organizationName: "",
    organizationDescription: "",
    websiteUrl: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName, // ← FIXED
          role: role,
          location: formData.location,
          skills: formData.skills,
          organizationName: formData.organizationName,
          organizationDescription: formData.organizationDescription,
          websiteUrl: formData.websiteUrl,
        }),
      });

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/");
      } else {
        alert("Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // 👆 END OF ADDED CODE

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Create an Account</h2>
        <p className="subtitle">
          Join SkillBridge to connect with NGOs and volunteering opportunities
        </p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name or organization name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label>I am a</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO / Organization</option>
          </select>

          <label>Location (Optional)</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. New York, NY"
            value={formData.location}
            onChange={handleChange}
          />

          {role === "volunteer" && (
            <>
              <label>Skills (Optional)</label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. web development, teaching, design (comma separated)"
                value={formData.skills}
                onChange={handleChange}
              />
            </>
          )}

          {role === "ngo" && (
            <>
              <label>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                placeholder="Enter your organization's name"
                value={formData.organizationName}
                onChange={handleChange}
              />

              <label>Organization Description</label>
              <textarea
                name="organizationDescription"
                placeholder="Tell us about your organization's mission and goals"
                value={formData.organizationDescription}
                onChange={handleChange}
              ></textarea>

              <label>Website URL (Optional)</label>
              <input
                type="text"
                name="websiteUrl"
                placeholder="https://www.yourorganization.org"
                value={formData.websiteUrl}
                onChange={handleChange}
              />
            </>
          )}

          <button type="submit">Create Account</button>

          <p className="signin-link">
            Already have an account?
            <span onClick={() => navigate("/")}> Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
