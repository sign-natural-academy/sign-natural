// src/components/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import { signupUser } from "../../api/services/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", password: "", repeatPassword: "", terms: false });
  const [loading, setLoading] = useState(false);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!form.terms) {
      alert("You must accept the Terms of Use");
      return;
    }
    setLoading(true);
    try {
      await signupUser({
        email: form.email,
        name: `${form.firstName} ${form.lastName}`.trim(), // <-- backend expects name
        password: form.password,
      });
      alert("Check your email to verify your account");
      // better UX: go to verify page with prefilled email
      // navigate("/verify-email?email=" + encodeURIComponent(form.email));
      // if you prefer your current flow:
      navigate("/verify-email");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen ">
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#faf8f6]">
          <img src="/woman2.jpg" alt="Sign Naturals" className="object-cover h-full w-full" />
        </div>

        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="flex justify-center mb-6"><Link to="/"><img src="/logo2.png" alt="Logo" className="h-20" /></Link></div>
            <h2 className="text-2xl font-bold text-[#455f30] mb-6">SIGN UP</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="Email" required className="w-full border border-gray-300 px-4 py-2 rounded" />
              <input type="text" value={form.firstName} onChange={(e) => onChange("firstName", e.target.value)} placeholder="First name" required className="w-full border border-gray-300 px-4 py-2 rounded" />
              <input type="text" value={form.lastName} onChange={(e) => onChange("lastName", e.target.value)} placeholder="Last name" required className="w-full border border-gray-300 px-4 py-2 rounded" />
              <input type="password" value={form.password} onChange={(e) => onChange("password", e.target.value)} placeholder="Password" required className="w-full border border-gray-300 px-4 py-2 rounded" />
              <input type="password" value={form.repeatPassword} onChange={(e) => onChange("repeatPassword", e.target.value)} placeholder="Repeat Password" required className="w-full border border-gray-300 px-4 py-2 rounded" />

              <div className="flex items-center space-x-2 text-sm">
                <input id="terms" checked={form.terms} onChange={(e) => onChange("terms", e.target.checked)} type="checkbox" className="accent-green-700" />
                <label htmlFor="terms">I agree to the <a href="#" className="underline">Terms of Use</a></label>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#455f30] text-white py-2 rounded">{loading ? "Signing up..." : "Sign Up"}</button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-700">Already have an account? <Link to="/login" className="text-green-700 hover:underline font-medium">Log in</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}
