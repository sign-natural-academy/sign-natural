import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import SuperuserDashboardLayout from "../dashboard/super/SuperuserDashboardLayout";

// Reuse the SAME admin modules so UI/UX = identical
import UsersManager from "../dashboard/admin/UsersManager";
import BookingManager from "../dashboard/admin/BookingManager";
import ApproveTestimonials from "../dashboard/admin/ApproveTestimonials";
import ProductManager from "../dashboard/admin/ProductManager";
import SettingsPanel from "../dashboard/admin/SettingsPanel";
import ReportsExport from "../dashboard/admin/ReportsExport";

export default function SuperuserDashboard() {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get("tab") || "overview";

  const View = useMemo(() => {
    switch (tab) {
      case "users":        return UsersManager;
      case "bookings":     return BookingManager;
      case "testimonials": return ApproveTestimonials;
      case "products":     return ProductManager;
      case "settings":     return SettingsPanel;
      case "reports":      return ReportsExport;
      default:
        return () => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">System Overview</div>
            <div className="bg-white p-4 rounded shadow">Recent Activity</div>
            <div className="bg-white p-4 rounded shadow">Quick Actions</div>
          </div>
        );
    }
  }, [tab]);

  return (
    <SuperuserDashboardLayout title="Superuser Dashboard">
      <View />
    </SuperuserDashboardLayout>
  );
}
