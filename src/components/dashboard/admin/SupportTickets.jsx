// src/components/dashboard/admin/SupportTickets.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listTickets, updateTicketStatus, replyToTicket } from "../../../api/services/support";

const PAGE_SIZE = 20;

export default function SupportTickets() {
  // List + UI state
  const [filters, setFilters] = useState({ q: "", status: "", category: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState([]);     // server items (array)
  const [total, setTotal] = useState(0);          // total count
  const [pages, setPages] = useState(1);          // total pages

  // Conversation panel
  const [active, setActive] = useState(null);     // currently opened ticket (object)
  const [reply, setReply] = useState("");         // reply textarea
  const [msg, setMsg] = useState("");             // transient message for UI feedback

  // Build query for service (only include set values)
  const query = useMemo(() => {
    const q = { page, limit: PAGE_SIZE };
    if (filters.q.trim()) q.q = filters.q.trim();
    if (filters.status) q.status = filters.status;
    if (filters.category) q.category = filters.category;
    if (filters.from && filters.to) { q.from = filters.from; q.to = filters.to; }
    return q;
  }, [filters, page]);

  // Initial + reactive load
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setError(""); setMsg("");
      try {
        const data = await listTickets(query);
        if (!alive) return;
        setTickets(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        // keep active ticket in sync if it exists
        if (active) {
          const updated = (data.items || []).find(t => t._id === active._id);
          if (updated) setActive(updated);
        }
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load tickets.");
        setTickets([]); setTotal(0); setPages(1);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [query]); // re-fetch on filters/page change

  // Open a ticket in the right panel
  const openTicket = (t) => {
    setActive(t);
    setReply("");
    setMsg("");
  };

  // Change status via backend, update local state
  const setStatus = async (id, nextStatus) => {
    try {
      const updated = await updateTicketStatus(id, nextStatus);
      // update in list
      setTickets(arr => arr.map(t => (t._id === id ? updated : t)));
      // update in panel if opened
      if (active && active._id === id) setActive(updated);
      setMsg(`Status changed to "${nextStatus.replace("_", " ")}".`);
    } catch (e) {
      console.error(e);
      setMsg("Failed to change status.");
    }
  };

  // Send admin reply
  const sendReply = async () => {
    const text = reply.trim();
    if (!active || !text) return;
    try {
      const updated = await replyToTicket(active._id, text);
      setActive(updated);
      setTickets(arr => arr.map(t => (t._id === updated._id ? updated : t)));
      setReply("");
      setMsg("Reply sent.");
    } catch (e) {
      console.error(e);
      setMsg("Failed to send reply.");
    }
  };

  const resetFilters = () => {
    setFilters({ q: "", status: "", category: "", from: "", to: "" });
    setPage(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left: list */}
      <div className="md:col-span-1 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Support Tickets</h3>
          <button
            onClick={() => { /* trigger reload by toggling page to same value */ setPage(p => p); }}
            className="px-2 py-1 border rounded text-sm"
          >
            Refresh
          </button>
        </div>

        {/* Filters mini-panel for list */}
        <div className="space-y-2 mb-3">
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Search subject…"
            value={filters.q}
            onChange={(e) => { setFilters({ ...filters, q: e.target.value }); setPage(1); }}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              className="border px-3 py-2 rounded w-full"
              value={filters.status}
              onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
            >
              <option value="">Any status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="Category"
              value={filters.category}
              onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => {
                const v = e.target.value;
                const to = filters.to;
                setFilters({ ...filters, from: v, to: to && v && v > to ? "" : to });
                setPage(1);
              }}
            />
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => { setFilters({ ...filters, to: e.target.value }); setPage(1); }}
            />
          </div>
          <div>
            <button className="px-3 py-1 border rounded text-sm" onClick={resetFilters}>Reset</button>
          </div>
        </div>

        {/* List body */}
        {loading ? (
          <div className="py-6 text-center">Loading…</div>
        ) : tickets.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No tickets</div>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t._id}
                onClick={() => openTicket(t)}
                className={`p-3 rounded cursor-pointer ${active?._id === t._id ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-xs text-gray-500 capitalize">{(t.status || "").replace("_", " ")}</div>
                </div>
                <div className="text-xs text-gray-500">{t.user?.name || "-"}</div>
                <div className="text-[11px] text-gray-400">
                  {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-3 flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="text-sm">Page {page} / {pages}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
          <span className="ml-auto text-xs text-gray-500">{total} total</span>
        </div>
      </div>

      {/* Right: conversation panel */}
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        {!active ? (
          <div className="text-center text-gray-500 py-10">Select a ticket to view conversation.</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">{active.subject}</h3>
                <div className="text-xs text-gray-500 capitalize">
                  {(active.status || "").replace("_", " ")} · {active.category || "general"}
                </div>
              </div>
              <div className="flex gap-2">
                {active.status !== "open" && (
                  <button onClick={() => setStatus(active._id, "open")} className="px-3 py-1 border rounded text-sm">Reopen</button>
                )}
                {active.status !== "in_progress" && (
                  <button onClick={() => setStatus(active._id, "in_progress")} className="px-3 py-1 border rounded text-sm">In Progress</button>
                )}
                {active.status !== "resolved" && (
                  <button onClick={() => setStatus(active._id, "resolved")} className="px-3 py-1 border rounded text-sm">Resolve</button>
                )}
                {active.status !== "closed" && (
                  <button onClick={() => setStatus(active._id, "closed")} className="px-3 py-1 border rounded text-sm">Close</button>
                )}
                <button onClick={() => setActive(null)} className="px-3 py-1 border rounded text-sm">Close Panel</button>
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-3 border-t pt-3">
              {(active.messages || []).map((m, idx) => {
                const isAdmin = (m.senderRole === "admin" || m.senderRole === "superuser");
                return (
                  <div key={idx} className={`p-3 rounded ${isAdmin ? "bg-green-50 ml-auto" : "bg-gray-50"} max-w-[90%]`}>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span className="capitalize">{m.senderRole || "user"}</span>
                      <span>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</span>
                    </div>
                    <div className="mt-1 text-sm whitespace-pre-wrap">{m.text}</div>
                  </div>
                );
              })}
              {(!active.messages || active.messages.length === 0) && (
                <div className="text-sm text-gray-500">No messages yet.</div>
              )}
            </div>

            <div className="mt-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full border px-3 py-2 rounded h-24"
                placeholder="Write a reply..."
              />
              <div className="mt-2 flex gap-2">
                <button onClick={sendReply} className="px-3 py-1 bg-[#7d4c35] text-white rounded">Send Reply</button>
                <button onClick={() => { setReply(""); setMsg(""); }} className="px-3 py-1 border rounded">Clear</button>
              </div>
              {msg && <div className="mt-2 text-sm text-gray-700">{msg}</div>}
              {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
