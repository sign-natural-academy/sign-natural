import React from 'react';

export default function SystemAlerts() {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-2">System Alerts</h2>
      <ul className="space-y-2">
        <li className="bg-red-100 p-3 rounded-md text-sm">
          Server maintenance scheduled for Sunday at 2AM.
        </li>
        <li className="bg-yellow-100 p-3 rounded-md text-sm">
          New updates available for the Admin Dashboard.
        </li>
        <li className="bg-green-100 p-3 rounded-md text-sm">
          User feedback implementation successfully deployed.
        </li>
      </ul>
    </div>
  );
}
