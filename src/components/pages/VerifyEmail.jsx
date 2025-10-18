import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendOtp } from "../../api/services/auth";
import { signIn } from "../../lib/auth";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const onVerify = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await verifyEmail({ email, otp });
      const { token, user } = res.data || {};
      if (!token || !user) throw new Error("Invalid response");
      signIn(token, user);
      navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    if (!email) return alert("Enter your email first.");
    setBusy(true);
    try {
      await resendOtp({ email });
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to resend OTP");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#faf8f6]">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Verify your email</h1>
        <form onSubmit={onVerify} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder="6-digit code"
            maxLength={6}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <button disabled={busy} className="w-full bg-[#455f30] text-white py-2 rounded">
            {busy ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm">
          <button onClick={onResend} disabled={busy} className="underline">
            Resend code
          </button>
          <Link to="/login" className="text-gray-600 underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
