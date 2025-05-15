import React from 'react';
import { LogOut } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white shadow flex justify-between items-center px-4 py-2 border-b w-full">
      <h1 className="text-xl font-bold text-gray-700">User Dashboard</h1>
      <div className="flex items-center space-x-3">
        <img src="/images/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        <button className="flex items-center text-sm text-red-500 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </button>
      </div>
    </header>
  );
}
