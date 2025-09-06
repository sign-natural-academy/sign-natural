// src/components/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../dashboard/admin/AdminDashboardLayout";
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
import { motion } from "framer-motion";

/**
 * Admin Dashboard page.
 * - Uses AdminDashboardLayout (handles admin guard + sidebar).
 * - Reads `?tab=` query param and renders the corresponding admin manager component.
 */
export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // derive active tab from query param (fallback to "bookings")
  const queryTab = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("tab") ? decodeURIComponent(p.get("tab")) : "bookings";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(queryTab);

  // update local active when URL changes
  useEffect(() => {
    setActiveTab(queryTab);
  }, [queryTab]);

  // helper to change tab (if you want to programmatically navigate later)
  const goToTab = (tabKey) => {
    const tabParam = tabKey ? `?tab=${encodeURIComponent(tabKey)}` : "";
    navigate(`/admin-dashboard${tabParam}`, { replace: false });
    setActiveTab(tabKey);
  };

  // map tab key => component
  const TabContent = useMemo(() => {
    return {
      overview: () => <div className="text-gray-600">Overview — analytics and recent activity will appear here.</div>,
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
    }[activeTab] || (() => <div className="text-gray-600">Select a section from the admin menu.</div>);
  }, [activeTab]);

  const ActiveComponent = TabContent;

  return (
    <AdminDashboardLayout title="Admin Dashboard">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="bg-white p-6 rounded shadow">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
            <div className="text-sm text-gray-500">Admin controls</div>
          </div>

          {/* Active panel */}
          <div className="min-h-[240px]">
            <ActiveComponent />
          </div>
        </div>
      </motion.div>
    </AdminDashboardLayout>
  );
}
