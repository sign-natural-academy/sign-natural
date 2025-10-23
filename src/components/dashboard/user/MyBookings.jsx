import React, { useEffect, useState } from "react";
import { getMyBookings } from "../../../api/services/bookings";

export default function MyBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">My Bookings</h3>
        <button onClick={load} className="px-3 py-1 border rounded">Refresh</button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500">No bookings yet.</div>
      ) : (
        <div className="overflow-x-auto">
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
                <tr key={b._id}>
                  <td className="px-3 py-2">{b?.item?.title || "—"}</td>
                  <td className="px-3 py-2">{b.itemType}</td>
                  <td className="px-3 py-2">{b.price > 0 ? `₵${b.price}` : "Free"}</td>
                  <td className="px-3 py-2 capitalize">{b.status}</td>
                  <td className="px-3 py-2">
                    {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
