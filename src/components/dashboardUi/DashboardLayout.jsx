// src/components/dashboardUi/DashboardLayout.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "../dashboard/user/Sidebar";
import { getUserRole, signOut } from "../../lib/auth";

import NotificationBell from "../ui/NotificationBell";
import useNotifications from "../../hooks/useNotifications";

// ---------- ADD: import the single-mark service ----------
import { markNotificationRead } from "../../api/services/notifications"; // adjust path if needed

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Memoize options so useNotifications receives a stable reference each render.
  const notifOptions = useMemo(() => ({ scope: "user" }), []);

  // Keep hook call order stable and top-level
  const { items, unread, markAllRead } = useNotifications(notifOptions);

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  // handle notification item clicks
  const handleNotifClick = async (notif) => {
    if (!notif) return;

    // Normalize id shape (some notifications use id, some _id)
    const notifId = notif._id || notif.id;

    // If already read, just follow the link/route if present
    if (notif.read) {
      if (notif.link) {
        // respect absolute or relative links
        if (notif.link.startsWith("/")) navigate(notif.link, { replace: false });
        else window.location.href = notif.link;
        return;
      }
      if (notif.action?.route) {
        navigate(notif.action.route);
        return;
      }
      return;
    }

    // Mark read, then navigate
    try {
      if (notifId) {
        // markNotificationRead should accept id; fallback to API call inside service
        await markNotificationRead(notifId);
      } else {
        // best-effort: call markNotificationRead with undefined will likely fail; ignore
        console.warn("handleNotifClick: notification missing id, skipping mark-as-read");
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    } finally {
      if (notif.link) {
        if (notif.link.startsWith("/")) navigate(notif.link, { replace: false });
        else window.location.href = notif.link;
      } else if (notif.action?.route) {
        navigate(notif.action.route);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (keeps controlled open state) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />

      {/* MOBILE BACKDROP: shows only when sidebarOpen on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/40"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* content wrapper: keep left padding on lg screens */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="bg-white shadow sticky top-0 z-40">
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 lg:py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7d4c35]"
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="truncate">
                <h1 className="text-base sm:text-lg font-semibold truncate">{title}</h1>
                <div className="text-xs text-gray-500 truncate">User panel</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Home: hide label on very small screens */}
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 shadow rounded text-sm hover:bg-gray-50"
                title="Go to homepage"
              >
                Home
              </Link>
              <Link
                to="/"
                className="inline-flex sm:hidden items-center justify-center w-9 h-9 shadow rounded hover:bg-gray-50"
                title="Home"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              {/* Notifications bell (keeps the same API you used) */}
              <div className="relative">
                <NotificationBell
                  items={items}
                  unread={unread}
                  markAllRead={markAllRead}
                  onItemClick={handleNotifClick}
                />
              </div>

              {/* Role display: hide label on tiny screens */}
              <div className="hidden sm:flex flex-col text-right mr-2">
                <span className="text-sm"></span>
                <span className="text-xs text-gray-600 font-medium">{role ?? "Member"}</span>
              </div>

              {/* Mobile compact role badge */}
              <div className="sm:hidden text-sm px-2 py-1 rounded text-gray-700">{role ? role.replace(/^./, r => r.toUpperCase()) : "Member"}</div>

              {/* Sign out: show icon on small screens */}
              <button
                onClick={() => { signOut(); navigate("/"); }}
                className="px-3 py-1 shadow rounded text-sm hover:bg-gray-50 flex items-center gap-2"
                title="Sign out"
              >
                <span className="hidden sm:inline">Sign out</span>
                <svg className="w-4 h-4 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M16 17l5-5-5-5M21 12H9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 19H6a2 2 0 01-2-2V7a2 2 0 012-2h7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-3 sm:px-6 py-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
