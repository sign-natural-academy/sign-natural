//src/components/ui/SystemAlerts.jsx

import React from "react";

export default function SystemAlerts() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-green-700">System Alerts</h3>
      <ul className="space-y-2">
        <li className="bg-red-50 text-red-800 p-3 rounded">Scheduled maintenance: Sunday 02:00 AM GMT.</li>
        <li className="bg-yellow-50 text-yellow-800 p-3 rounded">New dashboard update rolling out tonight.</li>
        <li className="bg-green-50 text-green-800 p-3 rounded">Feedback deployment was successful.</li>
      </ul>
    </div>
  );
}
