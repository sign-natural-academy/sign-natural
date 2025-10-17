// src/components/dashboard/admin/AdminDashboardLayout.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { isAdminRole, getUserRole, signOut } from "../../../lib/auth";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminDashboardLayout({ children, title = "Admin Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getUserRole());
  }, [location.pathname]);

  const roleStr = typeof role === "string" ? role : null;

  if (!isAdminRole()) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden px-2 py-1 border rounded"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <div className="text-xs text-gray-500">Admin panel</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Signed in as <span className="font-medium ml-1">{roleStr ?? "Admin"}</span>
              </div>

              <button
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="px-3 py-1 border rounded"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-6">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
