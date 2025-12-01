// src/components/dashboard/admin/BookingManager.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getAllBookings, updateBookingStatus } from "../../../api/services/bookings";
import useNotifications from "../../../hooks/useNotifications";

const STATUSES = ["all", "pending", "confirmed", "cancelled", "completed"];

export default function BookingManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [err, setErr] = useState("");

  // FILTERS state
  const [filters, setFilters] = useState({
    status: "all",
    from: "",
    to: "",
    q: "",
  });

  // server-side vs client-side fallback detection
  const [serverSupportsQuery, setServerSupportsQuery] = useState(true);

  // load bookings (optionally with filters). We attempt server-side filtering first.
  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setErr("");
      try {
        const params = { ...(opts.useFilters ? filters : {}), ...(opts.extra || {}) };

        const res = await getAllBookings(params);
        let list = Array.isArray(res.data) ? res.data : res.data?.items ?? res.data?.list ?? [];

        // Decide whether API accepted query params (best-effort)
        if (opts.useFilters && !Array.isArray(res.data) && (res.data?.items || res.data?.list)) {
          setServerSupportsQuery(true);
        }
        if (opts.useFilters && Array.isArray(res.data) && (filters.status !== "all" || filters.q || filters.from || filters.to)) {
          setServerSupportsQuery(false);
        }

        if (!serverSupportsQuery) {
          list = applyClientFilters(list, filters);
        }

        setRows(list);
      } catch (e) {
        console.error("Failed to load bookings:", e);
        setErr(e?.response?.data?.message || "Failed to load bookings");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, serverSupportsQuery]
  );

  useEffect(() => {
    load({ useFilters: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live refresh when booking events arrive
  useNotifications({
    onEvent: (payload) => {
      const t = payload?.type;
      if (!t) return;
      if (t === "new_booking" || t === "booking_updated" || t === "booking_created") {
        load({ useFilters: true });
      }
    },
  });

  const applyClientFilters = (list = [], f = {}) => {
    const q = (f.q || "").trim().toLowerCase();
    const fromD = f.from ? new Date(f.from) : null;
    const toD = f.to ? new Date(f.to) : null;
    if (toD) toD.setHours(23, 59, 59, 999);

    return list.filter((b) => {
      if (!b) return false;
      if (f.status && f.status !== "all" && String(b.status) !== f.status) return false;

      const dateStr = b.scheduledAt || b.createdAt || null;
      if (dateStr && (fromD || toD)) {
        const d = new Date(dateStr);
        if (fromD && d < fromD) return false;
        if (toD && d > toD) return false;
      }

      if (q) {
        const userName = (b.user && (b.user.name || "")).toString().toLowerCase();
        const userEmail = (b.user && b.user.email || "").toString().toLowerCase();
        const itemTitle = (b.item && (b.item.title || b.item.name || "")).toString().toLowerCase();
        if (!userName.includes(q) && !userEmail.includes(q) && !itemTitle.includes(q)) return false;
      }

      return true;
    });
  };

  useEffect(() => {
    load({ useFilters: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const changeStatus = async (id, status) => {
    if (!id || !status) return;
    setBusyId(id);
    setOpenMenuId(null);
    try {
      await updateBookingStatus(id, status);
      await load({ useFilters: true });
    } catch (e) {
      console.error("Failed to update booking status:", e);
      alert(e?.response?.data?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  // UI helpers
  const onFilterChange = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setFilters((p) => ({ ...p, [key]: val }));
  };

  const clearFilters = () => {
    setFilters({ status: "all", from: "", to: "", q: "" });
    setServerSupportsQuery(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bookings</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load({ useFilters: true })}
            disabled={loading}
            className="px-3 py-1 border rounded disabled:opacity-60 hover:bg-gray-50"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* MODERN FILTER CARD */}
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          {/* Left column: status + search (stacked on mobile) */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 w-full md:w-auto">
            {/* Status dropdown */}
            <div className="w-full md:w-44 shrink-0">
              <label className="text-xs text-gray-600 mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={onFilterChange("status")}
                className="w-full border rounded px-3 h-10 bg-white text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Search (stretches on mobile; constrained on desktop) */}
            <div className="mt-2 md:mt-0 flex-1 min-w-0">
              <label className="sr-only">Search</label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  placeholder="Search user, email or item"
                  value={filters.q}
                  onChange={onFilterChange("q")}
                  className="pl-10 pr-4 py-2 border rounded w-full h-10 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right column: date range + actions (stacked under on mobile) */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white border rounded px-2 h-10">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="date" value={filters.from} onChange={onFilterChange("from")} className="px-2 py-1 text-sm h-8 md:h-8" />
              </div>

              <div className="flex items-center gap-2 bg-white border rounded px-2 h-10">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="date" value={filters.to} onChange={onFilterChange("to")} className="px-2 py-1 text-sm h-8 md:h-8" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 md:mt-0 ml-auto">
              <button onClick={() => load({ useFilters: true })} className="px-3 py-2 bg-green-700 text-white rounded hover:bg-green-800">
                Apply
              </button>
              <button onClick={clearFilters} className="px-3 py-2 border rounded hover:bg-gray-100">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS INFO */}
      <div className="text-xs text-gray-500">
        {serverSupportsQuery ? "Server-side filtering" : "Client-side filtering (server lacks query support)"}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-3">User</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Item</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Scheduled</th>
              <th className="py-2 pr-3">Booked At</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="py-6 text-center text-gray-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={9} className="py-6 text-center text-gray-500">No bookings.</td></tr>
            ) : (
              rows.map((b) => {
                const id = b._id || b.id;
                const userName = (b.user && (b.user.name || b.user.fullName)) || "—";
                const userEmail = (b.user && b.user.email) || "—";
                const title = b.item?.title || b.item?.name || "—";
                const price = (typeof b.price === "number") ? `₵${b.price}` : "—";

                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="py-3 pr-3 font-medium">{userName}</td>
                    <td className="py-3 pr-3 text-xs text-gray-600">{userEmail}</td>
                    <td className="py-3 pr-3">{title}</td>
                    <td className="py-3 pr-3">{b.itemType || "—"}</td>
                    <td className="py-3 pr-3">{price}</td>
                    <td className="py-3 pr-3">{fmtDate(b.scheduledAt)}</td>
                    <td className="py-3 pr-3 text-xs text-gray-500">{fmtDate(b.createdAt)}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        b.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        b.status === "confirmed" ? "bg-green-100 text-green-800" :
                        b.status === "cancelled" ? "bg-red-100 text-red-800" :
                        b.status === "completed" ? "bg-sky-100 text-sky-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 pr-3 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                          className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                          aria-expanded={openMenuId === id}
                        >
                          Actions ▾
                        </button>

                        {openMenuId === id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <button
                                disabled={busyId === id || b.status === "confirmed"}
                                onClick={() => changeStatus(id, "confirmed")}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                              >
                                {busyId === id ? "Working…" : "Confirm"}
                              </button>

                              <button
                                disabled={busyId === id || b.status === "completed"}
                                onClick={() => changeStatus(id, "completed")}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                              >
                                {busyId === id ? "Working…" : "Mark Complete"}
                              </button>

                              <button
                                disabled={busyId === id || b.status === "cancelled"}
                                onClick={() => changeStatus(id, "cancelled")}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                              >
                                {busyId === id ? "Working…" : "Cancel"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
    </div>
  );
}
