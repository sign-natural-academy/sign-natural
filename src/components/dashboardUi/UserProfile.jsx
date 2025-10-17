//src/components/dashboardUi/UserProfile.jsx

import React from "react";

export default function UserProfile({ user = {} }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold">{user.name || "User Name"}</h3>
      <p className="text-sm text-gray-600">{user.email || "user@example.com"}</p>
    </div>
  );
}
