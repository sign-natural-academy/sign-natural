// src/components/dashboard/admin/BookingManager.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../../api/services/bookings";
import useNotifications from "../../../hooks/useNotifications";

const STATUSES = ["all", "pending", "confirmed", "cancelled", "completed"];

export default function BookingManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [err, setErr] = useState("");

  const [filters, setFilters] = useState({
    status: "all",
    from: "",
    to: "",
    q: "",
  });

  const [serverSupportsQuery, setServerSupportsQuery] = useState(true);

  /* ---------------- Load bookings ---------------- */
  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setErr("");
      try {
        const params = {
          ...(opts.useFilters ? filters : {}),
          ...(opts.extra || {}),
        };

        const res = await getAllBookings(params);
        let list = Array.isArray(res.data)
          ? res.data
          : res.data?.items ?? res.data?.list ?? [];

        if (
          opts.useFilters &&
          Array.isArray(res.data) &&
          (filters.status !== "all" || filters.q || filters.from || filters.to)
        ) {
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
    [filters, serverSupportsQuery]
  );

  useEffect(() => {
    load({ useFilters: true });
  }, []);

  /* ---------------- Live refresh ---------------- */
  useNotifications({
    onEvent: (payload) => {
      if (
        payload?.type === "new_booking" ||
        payload?.type === "booking_updated" ||
        payload?.type === "booking_created"
      ) {
        load({ useFilters: true });
      }
    },
  });

  /* ---------------- Client-side filters ---------------- */
  const applyClientFilters = (list = [], f = {}) => {
    const q = (f.q || "").trim().toLowerCase();
    const fromD = f.from ? new Date(f.from) : null;
    const toD = f.to ? new Date(f.to) : null;
    if (toD) toD.setHours(23, 59, 59, 999);

    return list.filter((b) => {
      if (!b) return false;
      if (f.status !== "all" && b.status !== f.status) return false;

      const d = new Date(b.scheduledAt || b.createdAt);
      if (fromD && d < fromD) return false;
      if (toD && d > toD) return false;

      if (q) {
        const name =
          (b.user?.name || b.contact?.name || "").toLowerCase();
        const email =
          (b.user?.email || b.contact?.email || "").toLowerCase();
        const item =
          (b.item?.title || b.item?.name || "").toLowerCase();

        if (!name.includes(q) && !email.includes(q) && !item.includes(q)) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    load({ useFilters: true });
  }, [filters]);

  /* ---------------- Status change ---------------- */
  const changeStatus = async (id, status) => {
    setBusyId(id);
    setOpenMenuId(null);
    try {
      await updateBookingStatus(id, status);
      await load({ useFilters: true });
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleString() : "—";

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white shadow rounded-lg p-5 space-y-5">
      <h3 className="font-semibold text-lg">Bookings</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th>User</th>
              <th>Email</th>
              <th>Item</th>
              <th>Type</th>
              <th>Price</th>
              <th>Scheduled</th>
              <th>Booked At</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  No bookings.
                </td>
              </tr>
            ) : (
              rows.map((b) => {
                const id = b._id;

                // ✅ FIXED DISPLAY LOGIC
                const displayName =
                  b.user?.name ||
                  b.contact?.name ||
                  "Guest";

                const displayEmail =
                  b.user?.email ||
                  b.contact?.email ||
                  "—";

                const isGuest = !b.user;

                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">
                      {displayName}
                      {isGuest && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Guest)
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-xs text-gray-600">
                      {displayEmail}
                    </td>

                    <td className="py-3">
                      {b.item?.title || b.item?.name || "—"}
                    </td>

                    <td className="py-3">{b.itemType}</td>

                    <td className="py-3">
                      {typeof b.price === "number" ? `₵${b.price}` : "—"}
                    </td>

                    <td className="py-3">{fmtDate(b.scheduledAt)}</td>
                    <td className="py-3 text-xs text-gray-500">
                      {fmtDate(b.createdAt)}
                    </td>

                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-xs bg-gray-100">
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === id ? null : id)
                        }
                        className="px-3 py-1 border rounded text-sm"
                      >
                        Actions ▾
                      </button>

                      {openMenuId === id && (
                        <div className="absolute bg-white border rounded shadow mt-1 right-5">
                          {["confirmed", "completed", "cancelled"].map(
                            (s) => (
                              <button
                                key={s}
                                onClick={() => changeStatus(id, s)}
                                disabled={busyId === id}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                              >
                                {s}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}
    </div>
  );
}
