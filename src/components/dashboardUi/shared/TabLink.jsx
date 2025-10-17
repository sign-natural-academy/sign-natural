// src/components/dashboardUi/shared/TabLink.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TabLink({
  to,               // full href (e.g. /user-dashboard?tab=bookings)
  icon: Icon,       // heroicon component
  label,            // "My Bookings"
  active = false,   // bool
  onClick,          // optional (close drawer, etc.)
}) {
  const base = "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium";
  const cls = active ? "bg-[#7d4c35] text-white" : "text-gray-700 hover:bg-gray-100";
  return (
    <Link to={to} onClick={onClick} className={`${base} ${cls}`}>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </Link>
  );
}
