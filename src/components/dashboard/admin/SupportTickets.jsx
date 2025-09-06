// src/components/dashboardUi/SupportTickets.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [reply, setReply] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/support", { headers: authHeaders() });
      setTickets(res.data?.tickets ?? res.data ?? []);
    } catch (err) {
      console.error(err);
      setTickets([
        { id: "t1", subject: "Booking question", status: "open", user: { name: "Ama" }, messages: [{ from: "user", text: "Hi, I need to reschedule" }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = (t) => setActive(t);

  const sendReply = async () => {
    if (!active || !reply) return;
    try {
      await api.post(`/api/support/${active.id}/reply`, { text: reply }, { headers: authHeaders() });
      setActive((a) => ({ ...a, messages: [...(a.messages || []), { from: "admin", text: reply, date: new Date().toISOString() }] }));
      setReply("");
      setMsg("Reply sent.");
    } catch (err) {
      console.error(err);
      setMsg("Failed to send reply.");
    }
  };

  const resolveTicket = async (id) => {
    try {
      await api.patch(`/api/support/${id}/resolve`, {}, { headers: authHeaders() });
      setTickets((s) => s.map((t) => (t.id === id ? { ...t, status: "resolved" } : t)));
      if (active?.id === id) setActive((a) => ({ ...a, status: "resolved" }));
      setMsg("Ticket resolved.");
    } catch (err) {
      console.error(err);
      setMsg("Failed to resolve.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Support Tickets</h3>
          <button onClick={load} className="px-2 py-1 border rounded text-sm">Refresh</button>
        </div>
        {loading ? (
          <div className="py-6 text-center">Loading…</div>
        ) : tickets.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No tickets</div>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <div key={t.id} onClick={() => openTicket(t)} className={`p-3 rounded cursor-pointer ${active?.id === t.id ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                <div className="flex justify-between">
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-xs text-gray-500">{t.status}</div>
                </div>
                <div className="text-xs text-gray-500">{t.user?.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        {!active ? (
          <div className="text-center text-gray-500 py-10">Select a ticket to view conversation.</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{active.subject}</h3>
              <div className="flex gap-2">
                <button onClick={() => resolveTicket(active.id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Resolve</button>
                <button onClick={() => setActive(null)} className="px-3 py-1 border rounded text-sm">Close</button>
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-3 border-t pt-3">
              {(active.messages || []).map((m, idx) => (
                <div key={idx} className={`p-3 rounded ${m.from === "admin" ? "bg-green-50 self-end" : "bg-gray-50"}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.date ? new Date(m.date).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="w-full border px-3 py-2 rounded h-24" placeholder="Write a reply..." />
              <div className="mt-2 flex gap-2">
                <button onClick={sendReply} className="px-3 py-1 bg-[#7d4c35] text-white rounded">Send Reply</button>
                <button onClick={() => { setReply(""); setMsg(""); }} className="px-3 py-1 border rounded">Clear</button>
              </div>
              {msg && <div className="mt-2 text-sm text-green-700">{msg}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
