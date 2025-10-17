// src/components/pages/VerifyEmail.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../lib/api";
import { signIn } from "../../lib/auth";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const presetEmail = useMemo(() => params.get("email") || "", [params]);
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-email", { email, otp });
      const { token, user } = res.data || {};
      if (!token || !user) throw new Error("Invalid verification response");
      signIn(token, user);
      navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await api.post("/api/auth/resend-otp", { email });
      alert("OTP resent. Check your email.");
    } catch (err) {
      alert(err.response?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-md space-y-3">
        <h2 className="text-xl font-semibold">Verify your email</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="border px-3 py-2 w-full rounded" />
        <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="6-digit code" className="border px-3 py-2 w-full rounded" />
        <button disabled={loading} className="w-full bg-[#455f30] text-white py-2 rounded">
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button type="button" onClick={resend} className="w-full border py-2 rounded">Resend Code</button>
      </form>
    </div>
  );
}
