// src/components/dashboard/admin/AuditLog.jsx
import React, { useEffect, useMemo, useState } from "react";
import { fetchAuditLogs } from "../../../api/services/audit";  // ✅ correct service import

const PAGE_SIZE = 20;

export default function AuditLog() {
  const [filters, setFilters] = useState({ actor: "", action: "", entityType: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile toggler

  const query = useMemo(() => {
    const q = { page, limit: PAGE_SIZE };
    if (filters.actor.trim()) q.actor = filters.actor.trim();
    if (filters.action.trim()) q.action = filters.action.trim();
    if (filters.entityType.trim()) q.entityType = filters.entityType.trim();
    if (filters.from && filters.to) { q.from = filters.from; q.to = filters.to; }
    return q;
  }, [filters, page]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAuditLogs(query);
        if (!alive) return;
        setItems(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load audit logs.");
        setItems([]);
        setTotal(0);
        setPages(1);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [query]);

  const resetFilters = () => {
    setFilters({ actor: "", action: "", entityType: "", from: "", to: "" });
    setPage(1);
  };

  const toggleRow = (id) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Audit Log</h2>
        <div className="text-sm text-gray-500">System activity & events</div>
      </div>

      {/* Filters: collapsible on tiny screens */}
      <div className="bg-white p-3 rounded shadow">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Filters</div>
          <div className="sm:hidden">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="px-2 py-1 border rounded text-sm"
              aria-expanded={filtersOpen}
            >
              {filtersOpen ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className={`${filtersOpen ? "block" : "hidden sm:block"} mt-3`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs block mb-1">Actor (User ID)</label>
              <input
                type="text"
                value={filters.actor}
                onChange={(e) => { setFilters({ ...filters, actor: e.target.value }); setPage(1); }}
                className="border px-3 py-2 rounded w-full"
                placeholder="Actor userId"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Action</label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => { setFilters({ ...filters, action: e.target.value }); setPage(1); }}
                className="border px-3 py-2 rounded w-full"
                placeholder="e.g. COURSE_UPDATED"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Entity Type</label>
              <select
                value={filters.entityType}
                onChange={(e) => { setFilters({ ...filters, entityType: e.target.value }); setPage(1); }}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="">Any</option>
                <option value="Testimonial">Testimonial</option>
                <option value="Booking">Booking</option>
                <option value="User">User</option>
                <option value="Product">Product</option>
                <option value="Course">Course</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1">From</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => {
                  const v = e.target.value;
                  const to = filters.to;
                  setFilters({ ...filters, from: v, to: to && v && v > to ? "" : to });
                  setPage(1);
                }}
                className="border px-3 py-2 rounded w-full"
                max={filters.to || undefined}
              />
            </div>
            <div>
              <label className="text-xs block mb-1">To</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => { setFilters({ ...filters, to: e.target.value }); setPage(1); }}
                className="border px-3 py-2 rounded w-full"
                min={filters.from || undefined}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
            <button onClick={resetFilters} className="px-3 py-2 border rounded text-sm w-full sm:w-auto">Reset Filters</button>
            <div className="text-sm text-gray-500 sm:ml-3">Showing page <span className="font-medium">{page}</span></div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && (
        <div className="space-y-2">
          {[1,2,3].map((n) => (
            <div key={n} className="animate-pulse bg-gray-100 rounded p-4" />
          ))}
        </div>
      )}

      {/* Table for md+; cards for small screens */}
      <div className="bg-white rounded shadow overflow-hidden">
        {/* small screens: cards */}
        <div className="md:hidden p-3 space-y-3">
          {!loading && items.length === 0 && <div className="text-center text-gray-500 py-6">No audit records.</div>}
          {items.map((row) => (
            <article key={row._id} className="border rounded p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{row.action || "-"}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{row.entityType || "-"} · {row.entityId || "-"}</div>
                  <div className="text-xs text-gray-400 mt-1">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-gray-600">Actor</div>
                  <div className="text-sm font-medium">{row.actor || "-"}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-xs text-gray-600 truncate max-w-xs">{row.ip || "-"}</div>
                <div className="flex gap-2 items-center">
                  <button className="text-blue-700 text-sm underline" onClick={() => toggleRow(row._id)}>
                    {expanded === row._id ? "Hide" : "View JSON"}
                  </button>
                </div>
              </div>

              {expanded === row._id && (
                <pre className="mt-3 text-xs whitespace-pre-wrap wrap-break-words bg-gray-50 p-2 rounded">
                  {JSON.stringify(row.meta ?? {}, null, 2)}
                </pre>
              )}
            </article>
          ))}
        </div>

        {/* md+ table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Actor</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Entity</th>
                <th className="text-left p-3">IP</th>
                <th className="text-left p-3">Agent</th>
                <th className="text-left p-3">Meta</th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-gray-500">No audit records.</td></tr>
              )}
              {items.map((row) => (
                <React.Fragment key={row._id}>
                  <tr className="border-t">
                    <td className="p-3 whitespace-nowrap">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}</td>
                    <td className="p-3">{row.actor || "-"}</td>
                    <td className="p-3">{row.action || "-"}</td>
                    <td className="p-3">{row.entityType || "-"} · {row.entityId || "-"}</td>
                    <td className="p-3">{row.ip || "-"}</td>
                    <td className="p-3 truncate max-w-[220px]" title={row.userAgent || ""}>{row.userAgent || "-"}</td>
                    <td className="p-3">
                      <button className="underline text-blue-700" onClick={() => toggleRow(row._id)}>
                        {expanded === row._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expanded === row._id && (
                    <tr className="bg-gray-50">
                      <td className="p-3" colSpan={7}>
                        <pre className="text-xs whitespace-pre-wrap wrap-break-word">
                          {JSON.stringify(row.meta ?? {}, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination: stacked on small screens */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="px-3 py-2 border rounded disabled:opacity-50 flex-1 sm:flex-none"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50 flex-1 sm:flex-none"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>

        <div className="text-sm mt-1 sm:mt-0">Page <span className="font-medium">{page}</span> / <span className="font-medium">{pages}</span></div>

        <div className="ml-auto text-xs text-gray-500">{total} total</div>
      </div>
    </div>
  );
}
