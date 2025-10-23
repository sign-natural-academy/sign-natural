// src/components/dashboard/user/BookingGrid.jsx
import React, { useEffect, useState } from "react";
import { getMyBookings } from "../../../api/services/bookings";
import { format } from "date-fns";

export default function BookingGrid() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await getMyBookings();
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load your bookings.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-gray-100 animate-pulse rounded" />
        <div className="h-10 bg-gray-100 animate-pulse rounded" />
        <div className="h-10 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded">
        {err}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-gray-600 bg-gray-50 border border-gray-200 p-4 rounded text-center">
        You don’t have any bookings yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2 pr-3">Item</th>
            <th className="py-2 pr-3">Type</th>
            <th className="py-2 pr-3">Scheduled</th>
            <th className="py-2 pr-3">Price</th>
            <th className="py-2 pr-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            // API returns booking.item populated (Course | Workshop)
            const title =
              (b.item && (b.item.title || b.item.name)) || "(no title)";
            const when = b.scheduledAt
              ? format(new Date(b.scheduledAt), "PPp")
              : "—";
            const price =
              typeof b.price === "number" && b.price > 0 ? `₵${b.price}` : "Free";

            return (
              <tr key={b._id} className="border-b last:border-b-0">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.item?.image || "/images/placeholder.jpg"}
                      alt={title}
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <div className="font-medium text-gray-900">{title}</div>
                  </div>
                </td>
                <td className="py-2 pr-3">{b.itemType}</td>
                <td className="py-2 pr-3">{when}</td>
                <td className="py-2 pr-3">{price}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : b.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={load}
          className="px-3 py-1 border rounded text-sm"
          title="Refresh"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
