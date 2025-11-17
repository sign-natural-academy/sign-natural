// src/components/user/Help.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  createTicket,
  listMyTickets,
} from "../../../api/services/support";

/**
 * Help & Support (User) — Read-only conversation for users.
 * - Users can create tickets (subject, category, message).
 * - Users can view ticket threads, but cannot reply (admin-only).
 *
 * Defensive: accepts axios-style responses (res.data) or direct payloads,
 * and tolerates tickets with either `id` or `_id`.
 */

function unwrap(res) {
  if (!res) return res;
  if (res.data !== undefined) return res.data;
  return res;
}

export default function Help() {
  // Tickets envelope shape from backend
  const [envelope, setEnvelope] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI: selected ticket
  const [activeTicket, setActiveTicket] = useState(null);

  // New ticket form
  const [form, setForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  // Pagination controls
  const page = envelope.page || 1;
  const pages = envelope.pages || 1;
  const tickets = Array.isArray(envelope) ? envelope : envelope.items || [];

  // Load tickets (page-aware)
  const loadTickets = async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await listMyTickets({ page: p, limit: 20 });
      const payload = unwrap(res);

      if (Array.isArray(payload)) {
        setEnvelope({ items: payload, total: payload.length, page: 1, pages: 1 });
      } else if (payload && Array.isArray(payload.items)) {
        setEnvelope({
          items: payload.items,
          total: payload.total || 0,
          page: payload.page || p,
          pages: payload.pages || 1,
        });
      } else {
        if (payload && (payload._id || payload.id)) {
          setEnvelope({ items: [payload], total: 1, page: 1, pages: 1 });
        } else {
          setEnvelope({ items: [], total: 0, page: 1, pages: 1 });
        }
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Failed to load tickets. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create ticket
  const onCreate = async (e) => {
    e?.preventDefault?.();
    setCreateMsg("");
    if (!form.subject?.trim() || !form.message?.trim()) {
      setCreateMsg("Please provide subject and message.");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        subject: String(form.subject).trim(),
        category: form.category?.trim() || undefined,
        priority: form.priority || "normal",
        message: String(form.message).trim(),
      };
      const res = await createTicket(payload);
      const created = unwrap(res);
      const ticket = created?.ticket || created;
      if (ticket) {
        setActiveTicket(ticket);
      }

      setForm({ subject: "", category: "", message: "", priority: "normal" });
      setCreateMsg("Ticket created.");
      await loadTickets(1);
    } catch (err) {
      console.error("Create ticket failed:", err);
      setCreateMsg(err?.response?.data?.message || "Failed to create ticket.");
    } finally {
      setCreating(false);
      setTimeout(() => setCreateMsg(""), 3500);
    }
  };

  // Open ticket by id or object; prefer already-loaded messages if present
  const openTicket = async (t) => {
    if (!t) return;
    if (Array.isArray(t.messages) && t.messages.length > 0) {
      setActiveTicket(t);
      return;
    }

    try {
      await loadTickets(page);
      const fresh = (Array.isArray(envelope) ? envelope : envelope.items) || [];
      const key = t._id || t.id;
      const found = fresh.find((x) => (x._id || x.id) === key) || t;
      setActiveTicket(found);
    } catch (err) {
      console.warn("Failed to refresh ticket before opening; opening provided object", err);
      setActiveTicket(t);
    }
  };

  // Pagination handlers
  const goPrev = () => {
    if (page <= 1) return;
    loadTickets(page - 1);
  };
  const goNext = () => {
    if (page >= pages) return;
    loadTickets(page + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Create + list */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Create a new support ticket</h3>
          <form onSubmit={onCreate} className="space-y-2">
            <div>
              <label className="text-xs block mb-1">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                className="w-full border px-3 py-2 rounded"
                placeholder="Short summary (e.g. Payment not credited)"
                required
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                className="w-full border px-3 py-2 rounded"
                placeholder="billing / booking / other"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                rows={5}
                className="w-full border px-3 py-2 rounded"
                placeholder="Explain the problem in detail..."
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={form.priority}
                onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))}
                className="border px-3 py-2 rounded"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>

              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-[#7d4c35] text-white rounded disabled:opacity-60"
              >
                {creating ? "Creating…" : "Create Ticket"}
              </button>
            </div>

            {createMsg && <div className="text-sm mt-2 text-gray-600">{createMsg}</div>}
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">My Tickets</h3>
            <button onClick={() => loadTickets(1)} className="text-sm px-2 py-1 border rounded">Refresh</button>
          </div>

          {loading ? (
            <div className="py-6 text-center text-gray-500">Loading…</div>
          ) : error ? (
            <div className="py-6 text-center text-red-600">{error}</div>
          ) : tickets.length === 0 ? (
            <div className="py-6 text-center text-gray-500">No tickets yet.</div>
          ) : (
            <ul className="space-y-2 max-h-[420px] overflow-y-auto">
              {tickets.map((t) => (
                <li
                  key={t._id || t.id || JSON.stringify(t)}
                  className={`p-3 rounded cursor-pointer ${activeTicket && (activeTicket._id || activeTicket.id) === (t._id || t.id) ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  onClick={() => openTicket(t)}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{t.subject}</div>
                    <div className="text-xs text-gray-500">{t.status}</div>
                  </div>
                  <div className="text-xs text-gray-500">{t.category || "—"}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : new Date(t.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div>Page {page} of {pages}</div>
            <div className="flex gap-2">
              <button onClick={goPrev} disabled={page <= 1} className="px-2 py-1 border rounded disabled:opacity-40">Prev</button>
              <button onClick={goNext} disabled={page >= pages} className="px-2 py-1 border rounded disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Active ticket view */}
      <div className="lg:col-span-2 bg-white p-4 rounded shadow min-h-[360px]">
        {!activeTicket ? (
          <div className="text-center text-gray-500 py-20">Select a ticket to view the conversation.</div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{activeTicket.subject}</h3>
                <div className="text-xs text-gray-500">{activeTicket.category || "—"} • Status: <span className="font-medium">{activeTicket.status}</span></div>
              </div>
              <div className="text-xs text-gray-500">{activeTicket.lastMessageAt ? new Date(activeTicket.lastMessageAt).toLocaleString() : ""}</div>
            </div>

            <div className="max-h-[440px] overflow-y-auto space-y-3 border-t pt-4 pb-4">
              {(activeTicket.messages || []).map((m, i) => (
                <div key={i} className={`p-3 rounded ${m.senderRole === "admin" ? "bg-gray-50" : "bg-green-50"}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.senderRole} • {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Replies are handled by our support team. You will be notified when an admin responds.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
