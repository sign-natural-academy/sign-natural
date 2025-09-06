import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import ConfirmModal from "../../dashboardUi/ConfirmModal";
import { motion } from "framer-motion";

/**
 * BookingManager - admin view to manage bookings and payments
 */
export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [action, setAction] = useState({ open: false, type: null, id: null });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/bookings", { headers: authHeaders() });
      setBookings(Array.isArray(res.data) ? res.data : res.data?.bookings ?? []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      // fallback dummy data
      setBookings([
        {
          id: "b-1",
          user: { name: "Amara", email: "amara@example.com" },
          itemTitle: "Glow & Sip Party",
          date: new Date().toISOString(),
          status: "paid",
          amount: "₵200",
        },
        {
          id: "b-2",
          user: { name: "Kwame", email: "kwame@example.com" },
          itemTitle: "Diasporan Glow Workshop",
          date: new Date(Date.now() + 86400000).toISOString(),
          status: "pending",
          amount: "₵300",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => (filter === "all" ? true : b.status === filter));

  const openConfirm = (type, id) => setAction({ open: true, type, id });
  const closeConfirm = () => setAction({ open: false, type: null, id: null });

  const performAction = async () => {
    if (!action.type || !action.id) return;
    setBusy(true);
    setMessage("");
    try {
      if (action.type === "cancel") {
        await api.patch(`/api/bookings/${action.id}`, { status: "cancelled" }, { headers: authHeaders() });
        setBookings((s) => s.map((x) => (x.id === action.id ? { ...x, status: "cancelled" } : x)));
        setMessage("Booking cancelled.");
      } else if (action.type === "attended") {
        await api.patch(`/api/bookings/${action.id}`, { status: "attended" }, { headers: authHeaders() });
        setBookings((s) => s.map((x) => (x.id === action.id ? { ...x, status: "attended" } : x)));
        setMessage("Marked as attended.");
      } else if (action.type === "refund") {
        // backend should process refund
        await api.post(`/api/payments/refund`, { bookingId: action.id }, { headers: authHeaders() });
        setBookings((s) => s.map((x) => (x.id === action.id ? { ...x, status: "refunded" } : x)));
        setMessage("Refund initiated.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Action failed. See console.");
    } finally {
      setBusy(false);
      closeConfirm();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bookings & Payments</h2>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-3 py-1 rounded">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="attended">Attended</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <button onClick={fetchBookings} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
        </div>
      </div>

      {message && <div className="mb-3 text-sm text-green-700">{message}</div>}

      {loading ? (
        <div className="py-8 text-center">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No bookings.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t">
                  <td className="px-4 py-3 text-sm">{b.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{b.user?.name ?? b.user?.email ?? "Guest"}</div>
                    <div className="text-xs text-gray-400">{b.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{b.itemTitle}</td>
                  <td className="px-4 py-3 text-sm">{b.date ? new Date(b.date).toLocaleString() : "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.status === "paid" ? "bg-green-100 text-green-700" :
                      b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "attended" ? "bg-blue-100 text-blue-700" :
                      b.status === "cancelled" ? "bg-red-100 text-red-700" :
                      b.status === "refunded" ? "bg-gray-100 text-gray-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{b.amount ?? "—"}</td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button onClick={() => openConfirm("attended", b.id)} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Mark attended</button>
                    <button onClick={() => openConfirm("cancel", b.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Cancel</button>
                    <button onClick={() => openConfirm("refund", b.id)} className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">Refund</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={action.open}
        title={action.type === "cancel" ? "Cancel booking" : action.type === "attended" ? "Mark attended" : "Process refund"}
        message={
          action.type === "cancel"
            ? "Are you sure you want to cancel this booking? This will notify the user."
            : action.type === "attended"
            ? "Mark this booking as attended?"
            : "Initiate a refund for this booking?"
        }
        onConfirm={performAction}
        onCancel={closeConfirm}
        busy={busy}
        confirmText={action.type === "refund" ? "Refund" : "Yes"}
      />
    </div>
  );
}
