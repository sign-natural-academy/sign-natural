import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../lib/api";
import { motion } from "framer-motion";

export default function BookingGrid() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // backend should support `/api/bookings/my` to derive user from token
        const res = await api.get("/api/bookings/my", { headers: authHeaders() });
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        // fallback dummy
        setBookings([
          {
            id: "b1",
            itemTitle: "Glow & Sip Party",
            date: "2025-01-15T14:00:00Z",
            status: "paid",
            amount: "₵200",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!confirm("Cancel booking?")) return;
    setBusyId(id);
    try {
      // prefer PATCH to set status - adjust if your backend uses DELETE
      await api.patch(`/api/bookings/${id}`, { status: "cancelled" }, { headers: authHeaders() });
      setBookings((s) => s.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="py-8 text-center">Loading bookings…</div>;

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div>
            <div className="font-semibold">{b.itemTitle}</div>
            <div className="text-sm text-gray-500">{new Date(b.date).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Status: {b.status}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{b.amount}</div>
            <button
              onClick={() => cancelBooking(b.id)}
              disabled={busyId === b.id || b.status === "cancelled"}
              className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-50"
            >
              {busyId === b.id ? "Cancelling…" : b.status === "cancelled" ? "Cancelled" : "Cancel"}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
