import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: "",
    userType: "",
    organizationName: "",
    location: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success: Account created for " + formData.userName);

        // 1. If your backend sends a token on signup, save it
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        const newUser = data.user || formData;

        // 2. ADDED: Save the user info so dashboards survive page refreshes
        localStorage.setItem("user", JSON.stringify(newUser));

        // 3. Redirect based on the userType they selected in the dropdown
        if (formData.userType === "organization") {
          navigate("/OrganizationDashboard", { state: { user: newUser } });
        } else {
          // If they selected 'volunteer' (or left it blank)
          navigate("/VolunteerDashboard", { state: { user: newUser } });
        }
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Backend is not running. Check your terminal!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-[#2d2929] p-5 font-sans">
      <form
        className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-[450px]"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-2 text-gray-800 text-center text-3xl font-bold leading-tight">
          Create Account
        </h2>
        <h4 className="mb-6 text-gray-600 text-center text-sm font-light leading-relaxed px-4">
          Join SkillBridge to connect with NGOs and volunteering opportunities
        </h4>

        {/* Username */}
        <div className="mb-[18px]">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="userName"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#764ba2] focus:ring-1 focus:ring-[#764ba2]"
            placeholder="Choose a username"
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-[18px]">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#764ba2] focus:ring-1 focus:ring-[#764ba2]"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>

        {/* User Type Selection */}
        <div className="mb-[18px]">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            I am a (Optional)
          </label>
          <select
            name="userType"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#764ba2] bg-white cursor-pointer"
            onChange={handleChange}
          >
            <option value="">Select Option</option>
            <option value="volunteer">Volunteer</option>
            <option value="organization">Organization</option>
          </select>
        </div>

        {/* CONDITIONAL SECTION: Organization Details */}
        {formData.userType === "organization" && (
          <div className="space-y-[18px] mb-[18px] p-4 bg-purple-50 rounded-lg border-l-4 border-[#764ba2] animate-in fade-in duration-500">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#764ba2] bg-white"
                placeholder="Enter official organization name"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Organization Description
              </label>
              <textarea
                name="organizationDescription"
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#764ba2] bg-white h-24 resize-none"
                placeholder="Tell us about your organization's mission..."
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div className="mb-[18px]">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#428fec] focus:ring-1 focus:ring-[#764ba2]"
            placeholder="Your name"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-[18px]">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#764ba2] focus:ring-1 focus:ring-[#764ba2]"
            placeholder="Create a password"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 p-3.5 bg-[#428fec] text-white rounded-lg text-lg font-bold shadow-md transition-all duration-300 hover:bg-[#3b7ed1] hover:-translate-y-0.5 active:translate-y-0"
        >
          Create Account
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
