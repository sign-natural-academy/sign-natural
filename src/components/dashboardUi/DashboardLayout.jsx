// src/components/dashboardUi/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUserRole } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/user/Sidebar";
export default function DashboardLayout({ children, title = "My Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { setRole(getUserRole()); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />
      <div className="lg:pl-64">
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen((s) => !s)} className="lg:hidden px-2 py-1 border rounded" aria-label="Toggle sidebar">☰</button>
              <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <div className="text-xs text-gray-500">User panel</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Signed in as <span className="font-medium ml-1">{role ?? "Member"}</span></div>
              <button
                onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
                className="px-3 py-1 border rounded"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
