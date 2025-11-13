import React, { useEffect, useMemo, useState } from "react";
import {
  adminListNotifications,
  adminMarkNotificationRead,
  adminMarkAllNotificationsRead,
  adminDeleteNotification,
} from "../../../api/services/notifications";

const PAGE_SIZE = 20;

export default function NotificationsPanel() {
  const [filters, setFilters] = useState({ type: "", read: "", from: "", to: "", q: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [selected, setSelected] = useState(new Set());
  const allSelected = useMemo(
    () => items.length > 0 && items.every((n) => selected.has(n._id)),
    [items, selected]
  );

  // Build query
  const query = useMemo(() => {
    const q = { page, limit: PAGE_SIZE };
    if (filters.type) q.type = filters.type;
    if (filters.read) q.read = filters.read;
    if (filters.q.trim()) q.q = filters.q.trim();
    if (filters.from && filters.to) {
      q.from = filters.from;
      q.to = filters.to;
    }
    return q;
  }, [filters, page]);

  // Fetch notifications
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setMsg("");
      try {
        const res = await adminListNotifications(query);
        if (!alive) return;

        setItems(res.data?.items ?? []);
        setTotal(res.data?.total ?? 0);
        setPages(res.data?.pages ?? 1);
        setSelected(new Set());
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setError("Failed to load notifications");
        setItems([]);
        setTotal(0);
        setPages(1);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [query]);

  // Selection handlers
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i._id)));
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Actions
  const onMarkRead = async (id, read = true) => {
    try {
      const res = await adminMarkNotificationRead(id, read);
      const updated = res.data;
      setItems((arr) => arr.map((n) => (n._id === id ? updated : n)));
      setMsg(read ? "Marked as read." : "Marked as unread.");
    } catch (err) {
      console.error(err);
      setMsg("Action failed.");
    }
  };

  const onBulkMarkRead = async (read = true) => {
    try {
      if (read) {
        await adminMarkAllNotificationsRead({
          ...(filters.type ? { type: filters.type } : {}),
          ...(filters.from && filters.to ? { from: filters.from, to: filters.to } : {}),
        });
        setItems((arr) => arr.map((n) => ({ ...n, read: true })));
        setSelected(new Set());
        setMsg("All matched marked as read.");
      } else {
        await Promise.all([...selected].map((id) => adminMarkNotificationRead(id, false)));
        setItems((arr) =>
          arr.map((n) => (selected.has(n._id) ? { ...n, read: false } : n))
        );
        setSelected(new Set());
        setMsg("Selected marked as unread.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Bulk action failed.");
    }
  };

  const onBulkDelete = async () => {
    try {
      await Promise.all([...selected].map((id) => adminDeleteNotification(id)));
      setItems((arr) => arr.filter((n) => !selected.has(n._id)));
      setSelected(new Set());
      setMsg("Deleted selected notifications.");
    } catch (err) {
      console.error(err);
      setMsg("Delete failed.");
    }
  };

  const resetFilters = () => {
    setFilters({ type: "", read: "", from: "", to: "", q: "" });
    setPage(1);
  };

  return (
    <div className="p-2 sm:p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold"></h2>
          <p className="text-xs text-gray-500">Admin audience</p>
        </div>

        <div className="bg-white rounded shadow p-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
          <input
            className="border px-3 py-2 rounded text-sm sm:col-span-2"
            placeholder="Search message/link/type…"
            value={filters.q}
            onChange={(e) => {
              setFilters({ ...filters, q: e.target.value });
              setPage(1);
            }}
          />
          <select
            className="border px-3 py-2 rounded text-sm"
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setPage(1);
            }}
          >
            <option value="">Any type</option>
            <option value="new_booking">new_booking</option>
            <option value="booking_status">booking_status</option>
            <option value="testimonial_pending_created">testimonial_pending_created</option>
            <option value="testimonial_approved">testimonial_approved</option>
            <option value="support_reply">support_reply</option>
          </select>
          <select
            className="border px-3 py-2 rounded text-sm"
            value={filters.read}
            onChange={(e) => {
              setFilters({ ...filters, read: e.target.value });
              setPage(1);
            }}
          >
            <option value="">Any read state</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              className="border px-3 py-2 rounded text-sm w-full"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => {
                const v = e.target.value;
                setFilters((f) => ({
                  ...f,
                  from: v,
                  to: f.to && v && v > f.to ? "" : f.to,
                }));
                setPage(1);
              }}
            />
            <input
              type="date"
              className="border px-3 py-2 rounded text-sm w-full"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => {
                setFilters({ ...filters, to: e.target.value });
                setPage(1);
              }}
            />
          </div>
          <div className="sm:col-span-5 flex gap-2">
            <button
              className="px-3 py-2 border rounded text-sm"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Status and actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          {loading ? "Loading…" : `${total} total`}
          {msg && <span className="ml-3 text-green-700">{msg}</span>}
          {error && <span className="ml-3 text-red-600">{error}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1 border rounded text-sm"
            onClick={() => onBulkMarkRead(true)}
          >
            Mark all (filtered) read
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={selected.size === 0}
            onClick={() => onBulkMarkRead(false)}
          >
            Mark selected unread
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={selected.size === 0}
            onClick={onBulkDelete}
          >
            Delete selected
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Message</th>
              <th className="px-3 py-2 text-left">Link</th>
              <th className="px-3 py-2">Read</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                  No notifications
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n._id} className={n.read ? "bg-white" : "bg-orange-50"}>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="checkbox"
                      checked={selected.has(n._id)}
                      onChange={() => toggleOne(n._id)}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium">{n.type || "-"}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {n.audience || "admin"}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="max-w-[380px] wrap-break-words">{n.message || "-"}</div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    {n.link ? (
                      <a
                        href={n.link}
                        className="text-blue-600 underline break-all"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {n.link}
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        n.read ? "bg-gray-200" : "bg-green-200"
                      }`}
                    >
                      {n.read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top whitespace-nowrap">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex gap-2">
                      {n.read ? (
                        <button
                          className="px-2 py-1 border rounded text-xs"
                          onClick={() => onMarkRead(n._id, false)}
                        >
                          Mark unread
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 border rounded text-xs"
                          onClick={() => onMarkRead(n._id, true)}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        className="px-2 py-1 border rounded text-xs"
                        onClick={async () => {
                          try {
                            await adminDeleteNotification(n._id);
                            setItems((arr) => arr.filter((x) => x._id !== n._id));
                          } catch (err) {
                            console.error(err);
                            setMsg("Delete failed.");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {pages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)} // ✅ fixed parenthesis
        >
          Next
        </button>
      </div>
    </div>
  );
}
