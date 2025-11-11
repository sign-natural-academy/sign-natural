// src/components/user/Settings.jsx
import React, { useState } from "react";
import { changeMyPassword } from "../../../api/services/auth";

export default function Settings() {
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Client-side notification prefs (placeholder for future backend wiring)
  const [prefs, setPrefs] = useState({
    emailUpdates: true,
    smsUpdates: false,
    sseLive: true,
  });

  const onPwChange = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    try {
      await changeMyPassword(pw.currentPassword, pw.newPassword);
      setMsg("Password changed.");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      // Friendly error message, no specifics leaked
      const msg = err?.response?.data?.message || "Invalid current password or request failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Settings</h3>

      {/* Password */}
      <form onSubmit={onChangePassword} className="bg-white p-4 rounded shadow space-y-3">
        <div className="text-sm font-semibold">Change Password</div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {msg && <div className="text-sm text-green-700">{msg}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs block mb-1">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              value={pw.currentPassword}
              onChange={onPwChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="text-xs block mb-1">New Password</label>
            <input
              name="newPassword"
              type="password"
              value={pw.newPassword}
              onChange={onPwChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Choose a strong password"
              required
            />
          </div>
        </div>

        <button
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
        >
          {saving ? "Updating…" : "Change Password"}
        </button>
        <div className="text-xs text-gray-500 mt-2">
          For your safety, we don’t reveal whether an email/password pair exists.
        </div>
      </form>

      {/* Notification preferences (client-only for now) */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div className="text-sm font-semibold">Notifications</div>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.emailUpdates}
              onChange={() => setPrefs((p) => ({ ...p, emailUpdates: !p.emailUpdates }))}
            />
            Email updates
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.smsUpdates}
              onChange={() => setPrefs((p) => ({ ...p, smsUpdates: !p.smsUpdates }))}
            />
            SMS updates
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.sseLive}
              onChange={() => setPrefs((p) => ({ ...p, sseLive: !p.sseLive }))}
            />
            Live in-app notifications
          </label>
        </div>
        <div className="text-xs text-gray-500">
          These preferences are stored locally for now. We’ll wire them to per-user settings later.
        </div>
      </div>
    </div>
  );
}
