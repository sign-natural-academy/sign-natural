// src/components/dashboardUi/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  PhotoIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * User Sidebar (user-only)
 * Props:
 *  - open: boolean (mobile drawer)
 *  - onClose: fn to close mobile drawer
 *  - role: optional string to display user role
 */
export default function Sidebar({ open = false, onClose = () => {}, role = null }) {
  const nav = [
    { key: "overview", label: "Overview", to: "/user-dashboard", icon: HomeIcon },
    { key: "free-tutorials", label: "Free Tutorials", to: "/user-dashboard?tab=Free%20Tutorials", icon: BookOpenIcon },
    { key: "my-bookings", label: "My Bookings", to: "/user-dashboard?tab=My%20Bookings", icon: CalendarIcon },
    { key: "my-stories", label: "My Stories", to: "/user-dashboard?tab=Post%20a%20Story", icon: PhotoIcon },
    { key: "profile", label: "Profile", to: "/user-dashboard?tab=User%20Profile", icon: UserCircleIcon },
    { key: "settings", label: "Settings", to: "/user-dashboard?tab=Settings", icon: Cog6ToothIcon },
    { key: "help", label: "Help", to: "/support", icon: QuestionMarkCircleIcon },
  ];

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-[#7d4c35] text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  // Desktop sidebar (fixed)
  const desktop = (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6">
        <img src="/logo2.png" alt="Logo" className="h-10 w-auto" />
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6 text-xs text-gray-500">Navigation</div>
        <div className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.key} to={item.to} className={linkClass}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
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
            <div className="text-sm font-semibold">You</div>
            <div className="text-xs text-gray-400">{role ?? "Learner"}</div>
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
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 border-t pt-4 text-sm text-gray-500">
          <div className="mb-2">Signed in as</div>
          <div className="flex items-center gap-3">
            <img src="/avatar-placeholder.png" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold">You</div>
              <div className="text-xs">{role ?? "Learner"}</div>
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
