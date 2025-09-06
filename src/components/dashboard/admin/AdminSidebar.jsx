// src/components/dashboard/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
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
  ChartBarIcon,
} from "@heroicons/react/24/outline";

/**
 * AdminSidebar
 * - Responsive sidebar for admin routes.
 * - Props:
 *    open: boolean (mobile drawer)
 *    onClose: fn to close mobile drawer
 */
export default function AdminSidebar({ open = false, onClose = () => {} }) {
  const nav = [
    { key: "overview", label: "Overview", to: "/admin-dashboard", icon: ChartBarIcon },
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
  ];

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-[#7d4c35] text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  // Desktop sidebar (fixed)
  const desktop = (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6">
        <img src="/logo2.png" alt="Logo" className="h-10 w-auto" />
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6 text-xs text-gray-500">Admin menu</div>
        <div className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.key} to={item.to} className={linkClass}>
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="text-xs text-gray-500 mb-2">Signed in as</div>
        <div className="flex items-center gap-3">
          <img src="/avatar-placeholder.png" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold">Samuel</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );

  // Mobile drawer
  const mobile = open ? (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <img src="/logo2.png" alt="logo" className="h-8" />
          <button onClick={onClose} className="text-gray-700">✖</button>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.key} to={item.to} onClick={onClose} className={linkClass}>
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 border-t pt-4 text-sm text-gray-500">
          <div className="mb-2">Signed in as</div>
          <div className="flex items-center gap-3">
            <img src="/avatar-placeholder.png" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold">Samuel</div>
              <div className="text-xs">Administrator</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  ) : null;

  return (
    <>
      {desktop}
      {mobile}
    </>
  );
}
