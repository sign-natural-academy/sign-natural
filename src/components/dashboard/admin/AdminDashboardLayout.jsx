// src/components/dashboard/admin/AdminDashboardLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AdminSidebar from "./AdminSidebar";
import { isAdminRole, getUserRole, signOut, isSuperuserRole } from "../../../lib/auth";

// 🔔 SSE notifications (admin audience)
import NotificationBell from "../../ui/NotificationBell";
import useNotifications from "../../../hooks/useNotifications";

// single-mark service (adjust path if your project places it elsewhere)
import { markNotificationRead } from "../../../api/services/notifications";

export default function AdminDashboardLayout({ children, title = "Admin Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Subscribe to admin notifications
  const { items, unread, markAllRead } = useNotifications({ scope: "admin" });

  useEffect(() => {
    setRole(getUserRole());
  }, [location.pathname]);

  const roleStr = typeof role === "string" ? role : null;

  // Access guard
  if (!isAdminRole() && !isSuperuserRole()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-lg w-full bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-semibold mb-2">Access denied</h2>
          <p className="text-sm text-gray-600 mb-6">
            You don't have permission to view this page.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/user-dashboard")}
              className="px-4 py-2 bg-green-700 text-white rounded"
            >
              Go to My Dashboard
            </button>
            <button
              onClick={() => {
                signOut();
                window.location.href = "/";
              }}
              className="px-4 py-2 border rounded"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // handle admin notification clicks: mark read (optimistic) then navigate
  const handleNotifClick = async (notif) => {
    if (!notif) return;

    // if already read, just navigate
    if (notif.read) {
      if (notif.link) return window.location.href = notif.link;
      if (notif.action?.route) return navigate(notif.action.route);
      return;
    }

    try {
      await markNotificationRead(notif._id || notif.id);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    } finally {
      if (notif.link) window.location.href = notif.link;
      else if (notif.action?.route) navigate(notif.action.route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar (controlled) */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MOBILE BACKDROP: shows only on small screens when sidebarOpen */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/40"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Page content wrapper keeps left padding on lg screens */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <header className="bg-white shadow sticky top-0 z-40">
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7d4c35]"
                aria-label="Toggle menu"
                aria-expanded={sidebarOpen}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="truncate">
                <h1 className="text-base sm:text-lg font-semibold truncate">{title}</h1>
                <div className="text-xs text-gray-500 truncate">Admin panel</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Home link: full label on sm+, icon-only on xs */}
              <Link
                to="/admin-dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 border rounded text-sm hover:bg-gray-50"
                title="Admin home"
              >
                Home
              </Link>
              <Link
                to="/admin-dashboard"
                className="inline-flex sm:hidden items-center justify-center w-9 h-9 border rounded hover:bg-gray-50"
                title="Admin Home"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              {/* Notifications bell (admin scope) */}
              <div className="relative">
                <NotificationBell
                  items={items}
                  unread={unread}
                  markAllRead={markAllRead}
                  onItemClick={handleNotifClick}
                />
              </div>

              {/* Role display: hide on tiny screens */}
              <div className="hidden sm:flex flex-col text-right mr-2">
                <span className="text-sm">Signed in as</span>
                <span className="text-xs text-gray-600 font-medium">{roleStr ?? "Admin"}</span>
              </div>

              <div className="sm:hidden text-sm px-2 py-1 rounded text-gray-700">{role ? role.replace(/^./, r => r.toUpperCase()) : "Admin"}</div>

              {/* Sign out: icon-only on xs */}
              <button
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center gap-2"
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
