import React, { useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/forgot-password", { email });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we’ll send you a reset code.
          </p>
        </div>

        {/* Success state */}
        {done ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              ✓
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Check your email
            </h3>
            <p className="text-sm text-gray-600">
              If an account exists for <strong>{email}</strong>, a verification
              code has been sent.
            </p>

            <Link
              to="/reset-password"
              className="inline-block rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Enter reset code
            </Link>

            <div className="pt-2">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
              {loading ? "Sending reset code…" : "Send reset code"}
            </button>

            {/* Footer links */}
            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Remembered your password?{" "}
                <span className="font-medium text-green-700">Sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
