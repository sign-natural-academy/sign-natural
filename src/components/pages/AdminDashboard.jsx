import React from "react";

import SystemAlerts from "../ui/SystemAlerts";

function DashboardCard({ title, description }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg hover:shadow-md transition duration-200">
      <h2 className="text-lg font-semibold text-green-700">{title}</h2>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>
    
      <div className="min-h-screen bg-gray-50 pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Admin Dashboard</h1>

          <div className="mb-8"><SystemAlerts /></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="User Management" description="View, add, or remove users and manage permissions." />
            <DashboardCard title="Content Control" description="Publish, edit, or delete courses and workshops." />
            <DashboardCard title="Reports & Analytics" description="Monitor performance and view user activity." />
          </div>
        </div>
      </div>
     
    </>
  );
}
