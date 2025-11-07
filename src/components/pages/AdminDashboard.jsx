// src/components/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AdminDashboardLayout from "../dashboard/admin/AdminDashboardLayout";

// Admin modules
import Overview from "../dashboard/admin/Overview";
import BookingManager from "../dashboard/admin/BookingManager";
import CourseManager from "../dashboard/admin/CourseManager";
import WorkshopManager from "../dashboard/admin/WorkshopManager";
import ProductManager from "../dashboard/admin/ProductManager";
import ApproveTestimonials from "../dashboard/admin/ApproveTestimonials";
import UsersManager from "../dashboard/admin/UsersManager";
import MediaLibrary from "../dashboard/admin/MediaLibrary";
import ReportsExport from "../dashboard/admin/ReportsExport";
import SettingsPanel from "../dashboard/admin/SettingsPanel";
import SupportTickets from "../dashboard/admin/SupportTickets";
import AuditLog from "../dashboard/admin/AuditLog";
import NotificationsPanel from "../dashboard/admin/NotificationsPanel";

/**
 * Admin Dashboard page.
 * - Uses AdminDashboardLayout (handles admin guard + sidebar).
 * - Reads `?tab=` query param and renders the corresponding admin manager component.
 * - Default tab is "overview" to match the sidebar.
 */
export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab from query param (fallback to "overview")
  const queryTab = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("tab") ? decodeURIComponent(p.get("tab")) : "overview";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(queryTab);

  // Keep local state in sync with URL
  useEffect(() => {
    setActiveTab(queryTab);
  }, [queryTab]);

  // Programmatic navigation helper (kept for future use)
  const goToTab = (tabKey) => {
    const tabParam = tabKey ? `?tab=${encodeURIComponent(tabKey)}` : "";
    navigate(`/admin-dashboard${tabParam}`, { replace: false });
    setActiveTab(tabKey);
  };

  // Map tab key -> component
  const TabContent = useMemo(() => {
    const map = {
      overview: () => <Overview />,
      notifications: () => <NotificationsPanel />,
      bookings: () => <BookingManager />,
      courses: () => <CourseManager />,
      workshops: () => <WorkshopManager />,
      products: () => <ProductManager />,
      testimonials: () => <ApproveTestimonials />,
      users: () => <UsersManager />,
      media: () => <MediaLibrary />,
      reports: () => <ReportsExport />,
      support: () => <SupportTickets />,
      audit: () => <AuditLog />,
      settings: () => <SettingsPanel />,
    };
    return map[activeTab] || (() => <Overview />);
  }, [activeTab]);

  const ActiveComponent = TabContent;

  // Pretty title
  const title = useMemo(() => {
    const t = (activeTab || "").replace(/_/g, " ");
    return t.charAt(0).toUpperCase() + t.slice(1);
  }, [activeTab]);

  return (
    <AdminDashboardLayout title={title || "Admin Dashboard"}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="bg-white p-6 rounded shadow">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold capitalize">{title}</h2>
            <div className="text-sm text-gray-500">Admin controls</div>
          </div>

          {/* Active panel */}
          <div className="min-h-60">
            <ActiveComponent />
          </div>
        </div>
      </motion.div>
    </AdminDashboardLayout>
  );
}
