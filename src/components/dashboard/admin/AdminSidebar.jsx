// src/components/dashboard/admin/AdminSidebar.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UsersIcon,
  PhotoIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,BellIcon
} from "@heroicons/react/24/outline";
import SidebarShell from "../../dashboardUi/shared/SidebarShell";
import { getActiveKey } from "../../dashboardUi/shared/navUtils";

export default function AdminSidebar({ open = false, onClose = () => {} }) {
  const location = useLocation();
  const active = getActiveKey(location, "overview");

  const nav = [
    { key: "overview", label: "Overview", to: "/admin-dashboard?tab=overview", icon: ChartBarIcon },
    { key: "bookings", label: "Bookings", to: "/admin-dashboard?tab=bookings", icon: CalendarIcon },
    { key: "courses", label: "Courses", to: "/admin-dashboard?tab=courses", icon: BookOpenIcon },
    { key: "workshops", label: "Workshops", to: "/admin-dashboard?tab=workshops", icon: HomeIcon },
    { key: "products", label: "Products", to: "/admin-dashboard?tab=products", icon: ShoppingBagIcon },
    { key: "testimonials", label: "Testimonials", to: "/admin-dashboard?tab=testimonials", icon: DocumentTextIcon },
    { key: "users", label: "Users", to: "/admin-dashboard?tab=users", icon: UsersIcon },
    { key: "media", label: "Media", to: "/admin-dashboard?tab=media", icon: PhotoIcon },
    { key: "reports", label: "Reports", to: "/admin-dashboard?tab=reports", icon: ChartBarIcon },
    { key: "support", label: "Support", to: "/admin-dashboard?tab=support", icon: ChatBubbleBottomCenterTextIcon },
    { key: "audit", label: "Audit", to: "/admin-dashboard?tab=audit", icon: ShieldCheckIcon },
    { key: "settings", label: "Settings", to: "/admin-dashboard?tab=settings", icon: Cog6ToothIcon },
    { key: "notifications", label: "Notifications", to: "/admin-dashboard?tab=notifications", icon: BellIcon }

  ];

  return (
    <SidebarShell
      open={open}
      onClose={onClose}
      navItems={nav}
      activeKey={active}
      sectionLabel="Admin menu"
      widthClass="lg:w-72"
    />
  );
}
