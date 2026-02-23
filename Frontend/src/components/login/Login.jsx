import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "volunteer",
    fullName: "",
    organizationName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Save the token to verify the user is logged in
        localStorage.setItem("token", data.token);

        // 2. ADDED: Save the user info so dashboards survive page refreshes
        localStorage.setItem("user", JSON.stringify(data.user));

        const loggedInUser = data.user;
        const actualRole = loggedInUser?.userType;

        if (!actualRole) {
          alert("Error: The backend did not return a 'userType'.");
          return;
        }

        // 3. Redirect STRICTLY based on the database role
        if (actualRole === "organization" || actualRole === "ngo") {
          navigate("/OrganizationDashboard", { state: { user: loggedInUser } });
        } else if (actualRole === "volunteer") {
          navigate("/VolunteerDashboard", { state: { user: loggedInUser } });
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check your terminal or backend connection.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-[#aedaf6] p-5 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-[400px]">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back" : "Join SkillBridge"}
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          {isLogin
            ? "Login to your account"
            : "Create an account to get started"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "volunteer" })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                formData.role === "volunteer"
                  ? "bg-white shadow text-[#428fec]"
                  : "text-gray-500"
              }`}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "ngo" })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                formData.role === "ngo"
                  ? "bg-white shadow text-[#428fec]"
                  : "text-gray-500"
              }`}
            >
              NGO / Org
            </button>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                {formData.role === "ngo" ? "Organization Name" : "Full Name"}
              </label>
              <input
                type="text"
                name={formData.role === "ngo" ? "organizationName" : "fullName"}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#428fec]"
                placeholder={formData.role === "ngo" ? "NGO Name" : "John Doe"}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#428fec]"
              placeholder="email@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#428fec]"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#428fec] text-white rounded-lg font-bold hover:bg-[#357abd] transition-colors shadow-lg"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-sm text-gray-600 hover:text-[#428fec] underline underline-offset-4"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
