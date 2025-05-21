import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/solid';

export default function AdminAlerts() {
  // Dummy alerts – can be replaced with props or fetched from backend later
  const dummyAlerts = [
    '🧪 New Skincare Formulation Course launching June 10!',
    '🌿 Join the 30-Day Herbal Challenge starting this Friday.',
    '📢 Live Q&A with instructors on May 25th – Don’t miss it!',
    '🚀 Workshop replays now available under "My Learning".',
  ];

  const [alerts, setAlerts] = useState(dummyAlerts);
  const [showAlerts, setShowAlerts] = useState(false);
  const [unread, setUnread] = useState(dummyAlerts.length);

  const handleToggle = () => {
    setShowAlerts((prev) => !prev);
    setUnread(0); // mark as read
  };

  return (
    <div className="relative inline-block text-left">
      {/* Notification Bell */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full bg-gray-100 hover:bg-green-200 focus:outline-none"
      >
        <BellIcon className="h-6 w-6 text-green-700" />
        {unread > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown Alert List */}
      {showAlerts && (
        <div className="origin-top-right absolute z-10 mt-2 w-80 rounded-md shadow-lg bg-white ring-1  ring-opacity-5">
          <div className="p-4 space-y-2 text-sm text-gray-700">
            <h4 className="text-base font-semibold text-green-700">Notification</h4>
            {alerts.length === 0 ? (
              <p className="text-gray-400 italic">No Notifications</p>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                {alerts.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
