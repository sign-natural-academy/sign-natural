// src/components/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/services/auth";
import { signIn } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, user } = res.data || {};
      if (!token || !user) throw new Error("Invalid login response");
      if (!user.emailVerified) {
        // Optional: force verification step if needed
        alert("Please verify your email before logging in.");
        navigate("/verify-email");
        return;
      }
      signIn(token, user);
      navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#faf8f6]">
        <img src="/woman.jpg" alt="Sign Natural" className="object-cover h-full w-full" />
      </div>

      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Link to="/"><img src="/logo2.png" alt="Logo" className="h-20 w-auto" /></Link>
          </div>
          <h2 className="text-2xl font-bold text-[#455f30] mb-6">LOGIN</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#455f30] text-white py-2 rounded hover:bg-green-900"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-green-700 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
