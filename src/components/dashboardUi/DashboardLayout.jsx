// src/components/dashboardUi/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "../dashboard/user/Sidebar";
import { getUserRole, signOut } from "../../lib/auth";

// 🔔 notifications
import useNotifications from "../../hooks/useNotifications";
import NotificationBell from "../ui/NotificationBell";

export default function DashboardLayout({ children, title = "My Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // SSE notifications for USER scope
  const { items, unread, markAllRead } = useNotifications({ scope: "user" });

  useEffect(() => { setRole(getUserRole()); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="lg:hidden px-2 py-1 border rounded"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <div className="text-xs text-gray-500">User panel</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Home link */}
              <Link
                to="/"
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                title="Go to homepage"
              >
                Home
              </Link>

              {/* 🔔 Notifications */}
              <NotificationBell
                items={items}
                unread={unread}
                markAllRead={markAllRead}
              />

              <div className="text-sm text-gray-600">
                Signed in as <span className="font-medium ml-1">{role ?? "Member"}</span>
              </div>
              <button
                onClick={() => { signOut(); navigate("/"); }}
                className="px-3 py-1 border rounded"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 max-w-7xl mx-auto">
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
