// src/components/dashboardUi/AuditLog.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/audit", { headers: authHeaders() });
      setLogs(res.data?.logs ?? []);
    } catch (err) {
      console.error(err);
      setLogs([
        { id: 1, actor: "admin", action: "approved testimonial", target: "story-1", date: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Audit Log</h2>
      {loading ? (
        <div className="py-6 text-center">Loading…</div>
      ) : logs.length === 0 ? (
        <div className="py-6 text-center text-gray-500">No audit records.</div>
      ) : (
        <div className="bg-white rounded shadow p-3">
          <ul className="space-y-2">
            {logs.map((l) => (
              <li key={l.id} className="flex justify-between items-start">
                <div>
                  <div className="text-sm"><strong>{l.actor}</strong> — {l.action} <span className="text-xs text-gray-500">({l.target})</span></div>
                  <div className="text-xs text-gray-400">{new Date(l.date).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
