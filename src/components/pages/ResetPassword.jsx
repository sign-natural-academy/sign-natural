// src/components/pages/ResetPassword.jsx
import React, { useState } from "react";
import api from "../../lib/api";
import { useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        otp,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification code sent to your email and choose a new
            password.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification code
            </label>
            <input
              type="text"
              required
              inputMode="numeric"
              placeholder="6-digit code"
              className="w-full rounded-lg border px-3 py-2 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-green-700"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a strong password"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 text-xs text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Use at least 8 characters. Avoid common words.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-green-700 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting password…" : "Reset password"}
          </button>

          {/* Footer */}
          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
