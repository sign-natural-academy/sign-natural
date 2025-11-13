// src/components/dashboard/admin/BookingManager.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getAllBookings, updateBookingStatus } from "../../../api/services/bookings";
import useNotifications from "../../../hooks/useNotifications";
const statuses = ["pending", "confirmed", "cancelled", "completed"];

export default function BookingManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setRows([]);
      alert(e?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 🔴 LIVE: refresh bookings table on new/updated bookings
  useNotifications({
    onEvent: (payload) => {
      const t = payload?.type;
      if (!t) return;
      if (t === "booking_created" || t === "booking_updated") {
        load();
      }
    },
  });

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg"></h3>
        <button onClick={load} disabled={loading} className="px-3 py-1 border rounded disabled:opacity-60">
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-3">User</th>
              <th className="py-2 pr-3">Item</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-6">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">No bookings.</td></tr>
            ) : (
              rows.map((b) => {
                const title = b.item?.title || "—";
                const user = b.user?.name || b.user?.email || "—";
                const price = typeof b.price === "number" ? `₵${b.price}` : "—";
                return (
                  <tr key={b._id} className="border-b">
                    <td className="py-3 pr-3">{user}</td>
                    <td className="py-3 pr-3">{title}</td>
                    <td className="py-3 pr-3">{b.itemType}</td>
                    <td className="py-3 pr-3">{price}</td>
                    <td className="py-3 pr-3">{b.status}</td>
                    <td className="py-3 pr-3">
                      <div className="flex gap-2">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            disabled={updatingId === b._id || b.status === s}
                            onClick={() => updateStatus(b._id, s)}
                            className={`px-2 py-1 rounded border text-xs
                              ${b.status === s ? "bg-gray-200" : "hover:bg-gray-50"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
