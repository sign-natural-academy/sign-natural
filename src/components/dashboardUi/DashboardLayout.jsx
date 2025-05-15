import React from 'react';
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const user = {
   
    profilePicture: 'https://via.placeholder.com/40', // Replace with dynamic user profile image
  };

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth token, redirect)
   
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex justify-between items-center bg-white shadow px-4 py-3 border-b">
        
 <Link to="/">
          <img src="/logo2.png" alt="Logo" className="h-20 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <img
            src={user.profilePicture}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span className="text-gray-700 font-medium">{user.name}</span>
          <button
            onClick={handleLogout}
            className="ml-3 text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4">{children}</main>
    </div>
  );
}
