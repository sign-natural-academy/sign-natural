// src/components/dashboard/admin/SettingsPanel.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";

export default function SettingsPanel() {
  const [settings, setSettings] = useState({ siteTitle: "", emailFrom: "", paymentProvider: "", paymentKeyMasked: "", webhookUrl: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/api/admin/settings", { headers: authHeaders() });
      setSettings(res.data?.settings ?? settings);
    } catch (err) {
      console.error("settings load:", err);
      // keep defaults
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      // Do not send raw secret fields unless they were changed - platform should accept masked placeholder.
      const payload = {
        siteTitle: settings.siteTitle,
        emailFrom: settings.emailFrom,
        paymentProvider: settings.paymentProvider,
        webhookUrl: settings.webhookUrl,
      };
      await api.put("/api/admin/settings", payload, { headers: authHeaders() });
      setMsg("Settings saved.");
    } catch (err) {
      console.error(err);
      setMsg("Failed to save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Platform Settings</h2>
      <form onSubmit={save} className="bg-white p-4 rounded shadow space-y-3">
        <div>
          <label className="text-sm block mb-1">Site Title</label>
          <input value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm block mb-1">From Email</label>
          <input value={settings.emailFrom} onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })} className="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm block mb-1">Payment Provider</label>
          <input value={settings.paymentProvider} onChange={(e) => setSettings({ ...settings, paymentProvider: e.target.value })} className="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm block mb-1">Webhook URL</label>
          <input value={settings.webhookUrl} onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })} className="border px-3 py-2 rounded w-full" />
        </div>

        <div className="text-sm text-gray-600">
          Note: Do not paste raw API secret keys here in plaintext. Use secure server vaults. If you must, contact backend team for secure storage.
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="px-4 py-2 bg-[#7d4c35] text-white rounded">{busy ? "Saving..." : "Save Settings"}</button>
          <button type="button" onClick={load} className="px-4 py-2 border rounded">Reload</button>
        </div>

        {msg && <div className="text-sm text-green-700">{msg}</div>}
      </form>
    </div>
  );
}
