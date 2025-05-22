import React from 'react';

export default function DashboardAnalytics() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Dashboard Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-xl font-semibold">1,250</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Scheduled Meetings</p>
          <p className="text-xl font-semibold">320</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Course Enrollments</p>
          <p className="text-xl font-semibold">890</p>
        </div>
      </div>
    </div>
  );
}
