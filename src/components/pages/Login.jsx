import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: call login API
      navigate("/user-dashboard");
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <div className="flex flex-col md:flex-row min-h-screen ">
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
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700" required />
              <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700" required />
              <button type="submit" disabled={loading} className="w-full bg-[#455f30] text-white py-2 rounded hover:bg-green-900">{loading ? "Logging in..." : "Log In"}</button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">Or log in with</div>
            <div className="flex justify-between mt-4 space-x-4">
              <button className="flex-1 border border-gray-300 rounded py-2 flex justify-center items-center hover:bg-gray-100 transition"><img src="/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" /> Google</button>
              <button className="flex-1 border border-gray-300 rounded py-2 flex justify-center items-center hover:bg-gray-100 transition"><img src="/linkedin-icon.svg" alt="LinkedIn" className="h-5 w-5 mr-2" /> LinkedIn</button>
              <button className="flex-1 border border-gray-300 rounded py-2 flex justify-center items-center hover:bg-gray-100 transition"><img src="/facebook-icon.svg" alt="Facebook" className="h-5 w-5 mr-2" /> Facebook</button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-700">Don&apos;t have an account? <Link to="/signup" className="text-green-700 hover:underline font-medium">Sign up</Link></div>
          </div>
        </div>
      </div>
   
    </>
  );
}
