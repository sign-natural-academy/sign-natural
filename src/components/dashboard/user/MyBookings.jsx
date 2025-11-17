// src/components/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { getMyBookings } from "../../../api/services/bookings";

/**
 * Mobile-first MyBookings
 * - Small screens: stacked cards with key info
 * - md+ screens: horizontal table (keeps original look)
 * - Preserves original API usage and refresh behavior
 */

function unwrap(res) {
  if (!res) return [];
  return Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : (res.data && Array.isArray(res.data) ? res.data : []);
}

export default function MyBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setRows(unwrap(res));
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const formatPrice = (p) => {
    if (p == null) return "—";
    if (Number(p) > 0) return `₵${Number(p).toLocaleString()}`;
    return "Free";
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="font-semibold text-lg">My Bookings</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            aria-label="Refresh bookings"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((n) => (
            <div key={n} className="animate-pulse bg-gray-100 rounded p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500">No bookings yet.</div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((b) => (
              <article key={b._id || b.id} className="border rounded p-3">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium">{b?.item?.title || "—"}</div>
                  <div className={`text-xs px-2 py-1 rounded ${b.status === "cancelled" ? "bg-red-100 text-red-700" : b.status === "completed" ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"}`}>
                    {b.status || "—"}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <div><span className="font-medium">Type:</span> {b.itemType || "—"}</div>
                  <div><span className="font-medium">Price:</span> {formatPrice(b.price)}</div>
                  <div><span className="font-medium">Scheduled:</span> {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "—"}</div>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop/tablet: original table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-left px-3 py-2">Type</th>
                  <th className="text-left px-3 py-2">Price</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Scheduled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((b) => (
                  <tr key={b._id || b.id}>
                    <td className="px-3 py-2">{b?.item?.title || "—"}</td>
                    <td className="px-3 py-2">{b.itemType || "—"}</td>
                    <td className="px-3 py-2">{formatPrice(b.price)}</td>
                    <td className="px-3 py-2 capitalize">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${b.status === "cancelled" ? "bg-red-100 text-red-700" : b.status === "completed" ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"}`}>
                        {b.status || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
