// src/components/dashboardUi/Topbar.jsx
import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";

export default function Topbar({ onToggleSidebar = () => {}, title = "Dashboard", role = null }) {
  return (
    <header className="w-full bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden px-2 py-1 shadow rounded">☰</button>
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {role && <div className="text-xs text-gray-500">{role}</div>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">2</span>
          </button>

          <div className="flex items-center gap-2">
            <img src="/avatar-placeholder.png" alt="avatar" className="w-9 h-9 rounded-full object-cover" />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">Samuel</div>
              <div className="text-xs text-gray-400">{role ?? "Member"}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
