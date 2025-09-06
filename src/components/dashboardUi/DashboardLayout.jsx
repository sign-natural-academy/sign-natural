// src/components/dashboardUi/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { motion } from "framer-motion";
import { getUserRole } from "../../lib/auth";

/**
 * DashboardLayout (User)
 * - User-focused dashboard layout.
 * - Sidebar and Topbar are user-specific.
 * - No admin-only access guard here (admin guard lives in AdminDashboardLayout).
 */
export default function DashboardLayout({ children, title = "My Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const r = getUserRole();
    setRole(r);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (desktop + mobile) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />

      {/* Page container (accounting for sidebar width on large screens) */}
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
                {role && <div className="text-xs text-gray-500">{role}</div>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification icon / small profile */}
              <div className="text-sm text-gray-600 hidden sm:block">Signed in as <span className="font-medium ml-1">{role ?? "Member"}</span></div>
              <div className="flex items-center gap-2">
                <img src="/avatar-placeholder.png" alt="avatar" className="w-9 h-9 rounded-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 py-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
