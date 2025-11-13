// src/components/user/Settings.jsx
import React, { useEffect, useState } from "react";
import { changeMyPassword } from "../../../api/services/auth";
import { getUserSettings, updateUserSettings } from "../../../api/services/userSettings";

export default function Settings() {
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Persisted notification prefs (loaded/saved from backend)
  const [prefs, setPrefs] = useState({
    emailUpdates: true,
    smsUpdates: false,
    sseLive: true,
  });
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsMsg, setPrefsMsg] = useState("");
  const [prefsError, setPrefsError] = useState("");

  // Load persisted preferences on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setPrefsLoading(true);
      try {
        const res = await getUserSettings(); // GET /api/user-settings
        if (!mounted) return;
        const data = res?.data || {};
        setPrefs({
          emailUpdates: !!data?.notifications?.emailUpdates,
          smsUpdates: !!data?.notifications?.smsUpdates,
          sseLive: !!data?.notifications?.sseLive,
        });
      } catch (err) {
        // Keep defaults but surface a non-blocking message
        console.warn("Failed to load user settings:", err?.message || err);
        if (mounted) setPrefsError("Failed to load preferences (showing defaults).");
      } finally {
        if (mounted) setPrefsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Password handlers (unchanged behaviour)
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
      const msg = err?.response?.data?.message || "Invalid current password or request failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Toggle a preference (optimistic UI) and persist to backend
  const togglePref = (key) => async () => {
    setPrefsMsg("");
    setPrefsError("");

    const prev = { ...prefs };
    const next = { ...prefs, [key]: !prefs[key] };

    // optimistic UI update
    setPrefs(next);
    setPrefsSaving(true);

    try {
      await updateUserSettings({ notifications: next }); // PATCH /api/user-settings
      setPrefsMsg("Preferences saved.");
    } catch (err) {
      console.error("Failed to save prefs:", err);
      setPrefs(prev); // rollback
      setPrefsError("Failed to save preferences. Try again.");
    } finally {
      setPrefsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold"></h3>

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
        {/* <div className="text-xs text-gray-500 mt-2">
          For your safety, we don’t reveal whether an email/password pair exists.
        </div> */}
      </form>

      {/* Notification preferences (persisted) */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Notifications</div>
          <div className="text-xs text-gray-500">
            {prefsLoading ? "Loading…" : prefsSaving ? "Saving…" : prefsMsg || ""}
          </div>
        </div>

        {prefsError && <div className="text-sm text-red-600">{prefsError}</div>}

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.emailUpdates}
              onChange={togglePref("emailUpdates")}
              disabled={prefsLoading || prefsSaving}
            />
            Email updates
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.smsUpdates}
              onChange={togglePref("smsUpdates")}
              disabled={prefsLoading || prefsSaving}
            />
            SMS updates
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.sseLive}
              onChange={togglePref("sseLive")}
              disabled={prefsLoading || prefsSaving}
            />
            Live in-app notifications
          </label>
        </div>

        <div className="text-xs text-gray-500">
          These preferences are saved to your account and control how we notify you.
        </div>
      </div>
    </div>
  );
}
