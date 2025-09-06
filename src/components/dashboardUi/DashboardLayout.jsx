import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
