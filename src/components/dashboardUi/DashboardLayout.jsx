import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardLayout({ children, activeTab, setActiveTab, tabs }) {
  const user = {
    name: 'User Name',
    profilePicture: 'https://via.placeholder.com/40',
  };

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth token, redirect)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="flex justify-between items-center bg-white shadow px-4 py-3">
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

      {/* Tab Navigation */}
      <nav className="bg-white shadow px-4 py-2 flex gap-3  overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 rounded-full transition ${
              activeTab === tab
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Page Content */}
      <main className="p-4 flex-1">{children}</main>
    </div>
  );
}
