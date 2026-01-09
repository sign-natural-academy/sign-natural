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
  const [expandedId, setExpandedId] = useState(null);
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

        if (!serverSupportsQuery) {
          list = applyClientFilters(list, filters);
        }

        setRows(list);
      } catch (e) {
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

  const applyClientFilters = (list = [], f = {}) => {
    const q = (f.q || "").trim().toLowerCase();
    return list.filter((b) => {
      if (f.status !== "all" && b.status !== f.status) return false;
      if (!q) return true;

      const name =
        (b.user?.name || b.contact?.name || "").toLowerCase();
      const email =
        (b.user?.email || b.contact?.email || "").toLowerCase();
      const item =
        (b.item?.title || b.item?.name || "").toLowerCase();

      return (
        name.includes(q) || email.includes(q) || item.includes(q)
      );
    });
  };

  const changeStatus = async (id, status) => {
    setBusyId(id);
    setOpenMenuId(null);
    try {
      await updateBookingStatus(id, status);
      await load({ useFilters: true });
    } finally {
      setBusyId(null);
    }
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleString() : "—";

  return (
    <div className="bg-white shadow rounded-lg p-5 space-y-5">
      <h3 className="font-semibold text-lg">Bookings</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 shadow">
              <th>User</th>
              <th>Email</th>
              <th>Mode</th>
              <th>Item</th>
              <th>Type</th>
              <th>Price</th>
              <th>Scheduled</th>
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
            ) : (
              rows.map((b) => {
                const id = b._id;
                const isExpanded = expandedId === id;

                const displayName =
                  b.user?.name || b.contact?.name || "Guest";
                const displayEmail =
                  b.user?.email || b.contact?.email || "—";

                const bookingMode = !b.user
                  ? "Guest"
                  : b.attendees?.length > 0
                  ? "For Others"
                  : "Self";

                return (
                  <React.Fragment key={id}>
                    <tr className=" hover:bg-gray-50">
                      <td className="py-3 font-medium">{displayName}</td>
                      <td className="py-3 text-xs text-gray-600">
                        {displayEmail}
                      </td>

                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            bookingMode === "Guest"
                              ? "bg-gray-100"
                              : bookingMode === "For Others"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {bookingMode}
                        </span>

                        {bookingMode === "For Others" && (
                          <button
                            onClick={() =>
                              setExpandedId(
                                isExpanded ? null : id
                              )
                            }
                            className="ml-2 text-xs text-blue-600 hover:underline"
                          >
                            {isExpanded ? "Hide" : "View"} attendees
                          </button>
                        )}
                      </td>

                      <td className="py-3">
                        {b.item?.title || b.item?.name || "—"}
                      </td>

                      <td className="py-3">{b.itemType}</td>

                      <td className="py-3">
                        {typeof b.price === "number"
                          ? `₵${b.price}`
                          : "—"}
                      </td>

                      <td className="py-3">{fmtDate(b.scheduledAt)}</td>

                      <td className="py-3">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100">
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === id ? null : id
                            )
                          }
                          className="px-3 py-1  rounded text-sm"
                        >
                          Actions ▾
                        </button>

                        {openMenuId === id && (
                          <div className="absolute bg-white border rounded shadow mt-1 right-5 z-10">
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

                    {/* ✅ EXPANDED ATTENDEES ROW */}
                    {isExpanded && b.attendees?.length > 0 && (
                      <tr className="bg-blue-50">
                        <td colSpan={9} className="px-6 py-3">
                          <div className="text-xs text-gray-700">
                            <strong className="block mb-1">
                              Attendees
                            </strong>
                            <ul className="list-disc pl-5 space-y-1">
                              {b.attendees.map((a, i) => (
                                <li key={i}>
                                  {a.email || "—"}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
