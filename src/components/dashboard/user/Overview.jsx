// src/components/user/Overview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../lib/api";
import useNotifications from "../../../hooks/useNotifications";
/**
 * User Overview (Analytics Snapshot)
 * - KPIs: Unread notifications, total bookings, upcoming booking, stories (approved/pending)
 * - Breakdown: bookings by status
 * - Suggested free tutorials (top 5) -> now redirect to tutorials tab
 * - Recent activity (bookings + notifications)
 * - Live unread via SSE
 */
export default function Overview() {
  const navigate = useNavigate();

  // Data buckets
  const [bookings, setBookings] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live notifications via SSE (user scope)
  const { items: notifItems, unread, markAllRead } = useNotifications({ scope: "user" });

  // Load initial data from existing endpoints
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const [bRes, nRes, tRes, cRes] = await Promise.all([
          api.get("/api/bookings/me"),
          api.get("/api/notifications"),         // initial pull; SSE keeps unread live
          api.get("/api/testimonials/me"),
          api.get("/api/courses", { params: { type: "free", limit: 5 } }),
        ]);

        if (!mounted) return;
        setBookings(Array.isArray(bRes.data) ? bRes.data : []);
        setMyStories(Array.isArray(tRes.data) ? tRes.data : []);
        setFreeCourses(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        console.error("Overview load failed:", e?.message || e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  // === Derived analytics ===

  // Next upcoming booking (future scheduledAt) else latest created
  const nextBooking = useMemo(() => {
    if (!bookings.length) return null;
    const future = bookings
      .filter((b) => b.scheduledAt && new Date(b.scheduledAt).getTime() > Date.now())
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    if (future.length) return future[0];
    return [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
  }, [bookings]);

  // Count bookings by status
  const bookingStats = useMemo(() => {
    const stats = { total: bookings.length, pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
    for (const b of bookings) {
      const s = (b.status || "").toLowerCase();
      if (s in stats) stats[s] += 1;
    }
    return stats;
  }, [bookings]);

  // Stories: approved vs pending
  const storyStats = useMemo(() => {
    let approved = 0, pending = 0;
    for (const s of myStories) {
      if (s.approved) approved += 1; else pending += 1;
    }
    return { total: myStories.length, approved, pending };
  }, [myStories]);

  // Recent activity: mix notifications + bookings
  const recentActivity = useMemo(() => {
    const ns = (notifItems || []).slice(0, 10).map((n) => ({
      kind: "notification",
      id: String(n._id || n.id),
      title: n.message || "Notification",
      date: n.createdAt || n.date || new Date().toISOString(),
      read: !!n.read,
    }));
    const bs = bookings.slice(0, 10).map((b) => ({
      kind: "booking",
      id: String(b._id || b.id),
      title: `Booking ${b.itemType || ""} — ${b.status || "pending"}`.trim(),
      date: b.updatedAt || b.createdAt || new Date().toISOString(),
      meta: {
        when: b.scheduledAt || null,
        itemName: b.item?.title || b.item?.name || "",
      },
    }));
    return [...ns, ...bs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [notifItems, bookings]);

  // Utils
  const fmt = (d) => { try { return new Date(d).toLocaleString(); } catch { return ""; } };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold"></h2>
          <div className="text-xs text-gray-500">Your activity at a glance</div>
        </div>
        <button
          onClick={markAllRead}
          disabled={(unread || 0) === 0}
          className="px-3 py-1 shadow rounded text-sm disabled:opacity-50"
        >
          Mark all read
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Unread notifications */}
        <div className="bg-white rounded shadow p-4">
          <div className="text-xs text-gray-500">Unread notifications</div>
          <div className="mt-1 text-3xl font-semibold">{unread || 0}</div>
          <div className="mt-3">
            <Link to="/user-dashboard?tab=tutorials" className="text-xs px-2 py-1 shadow rounded hover:bg-gray-50">
              Continue learning
            </Link>
          </div>
        </div>

        {/* Total bookings */}
        <div className="bg-white rounded shadow p-4">
          <div className="text-xs text-gray-500">Total bookings</div>
          <div className="mt-1 text-3xl font-semibold">{bookingStats.total}</div>
          <div className="mt-2 text-xs text-gray-500">
            {bookingStats.confirmed} confirmed • {bookingStats.pending} pending
          </div>
        </div>

        {/* Next booking */}
        <div className="bg-white rounded shadow p-4">
          <div className="text-xs text-gray-500">Next booking</div>
          {loading ? (
            <div className="mt-2 h-6 bg-gray-100 rounded animate-pulse" />
          ) : nextBooking ? (
            <>
              <div className="mt-1 text-sm font-medium">
                {nextBooking.item?.title || nextBooking.item?.name || nextBooking.itemType}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {nextBooking.scheduledAt ? `When: ${fmt(nextBooking.scheduledAt)}` : `Status: ${nextBooking.status}`}
              </div>
            </>
          ) : (
            <div className="mt-1 text-sm text-gray-600">No upcoming booking</div>
          )}
          <div className="mt-3">
            <Link to="/user-dashboard?tab=bookings" className="text-xs px-2 py-1 shadow rounded hover:bg-gray-50">
              View bookings
            </Link>
          </div>
        </div>

        {/* Stories */}
        <div className="bg-white rounded shadow p-4">
          <div className="text-xs text-gray-500">My stories</div>
          <div className="mt-1 text-3xl font-semibold">{storyStats.total}</div>
          <div className="mt-2 text-xs text-gray-500">
            {storyStats.approved} approved • {storyStats.pending} pending
          </div>
        </div>
      </div>

      {/* Bookings by status */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Bookings by status</h3>
        {loading ? (
          <div className="h-20 bg-gray-100 rounded animate-pulse" />
        ) : bookingStats.total === 0 ? (
          <div className="text-sm text-gray-600">No bookings yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="shadow rounded p-3">
              <div className="text-xs text-gray-500">Pending</div>
              <div className="text-xl font-semibold">{bookingStats.pending}</div>
            </div>
            <div className="shadow rounded p-3">
              <div className="text-xs text-gray-500">Confirmed</div>
              <div className="text-xl font-semibold">{bookingStats.confirmed}</div>
            </div>
            <div className="shadow rounded p-3">
              <div className="text-xs text-gray-500">Completed</div>
              <div className="text-xl font-semibold">{bookingStats.completed}</div>
            </div>
            <div className="shadow rounded p-3">
              <div className="text-xs text-gray-500">Cancelled</div>
              <div className="text-xl font-semibold">{bookingStats.cancelled}</div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested free tutorials */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Suggested free tutorials</h3>
          <Link to="/user-dashboard?tab=tutorials" className="text-sm text-[#7d4c35]">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : freeCourses.length === 0 ? (
          <div className="text-sm text-gray-600">No free tutorials yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {freeCourses.map((c) => (
              <div key={c._id} className="shadow rounded p-3 hover:shadow-sm transition">
                <div className="text-sm font-medium line-clamp-2">{c.title}</div>
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.title}
                    className="mt-2 h-24 w-full object-cover rounded"
                  />
                )}
                <button
                  onClick={() => navigate("/user-dashboard?tab=tutorials")}
                  className="mt-2 text-xs px-2 py-1 shadow rounded"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Recent activity</h3>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-sm text-gray-600">Nothing recent yet.</div>
        ) : (
          <ul className="divide-y">
            {recentActivity.map((a) => (
              <li key={`${a.kind}-${a.id}`} className="py-2 flex items-start justify-between">
                <div className="pr-3">
                  <div className="text-sm">
                    <span className="font-medium">
                      {a.kind === "notification" ? "Notification:" : "Booking:"}
                    </span>{" "}
                    {a.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {fmt(a.date)}
                    {a.kind === "booking" && a.meta?.when ? <> • Scheduled: {fmt(a.meta.when)}</> : null}
                  </div>
                </div>
                {a.kind === "notification" ? (
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      a.read ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {a.read ? "Read" : "Unread"}
                  </span>
                ) : (
                  <Link
                    to="/user-dashboard?tab=bookings"
                    className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                  >
                    View
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
