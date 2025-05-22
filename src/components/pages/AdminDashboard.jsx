// pages/AdminDashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../dashboardUi/DashboardLayout';
import { motion } from 'framer-motion';
import UserStoriesModeration from '../dashboardUi/UserStoriesModeration';
import UserManager from '../dashboardUi/UserManager';
import PaymentReports from '../dashboardUi/PaymentReports';
import ExperienceManager from '../dashboardUi/ExperienceManager';
import SiteSettings from '../dashboardUi/SiteSettings';
import AdminCourseManager from '../dashboardUi/AdminCourseManager';
import AdminBookingsPanel from '../dashboardUi/AdminBookingsPanel';
import AdminProfile from '../dashboardUi/AdminProfile';
import DashboardAnalytics from '../DashBoardAnalytics';

// Dummy fallback content
const dummyUsers = [
  { id: 1, name: 'Ama Boakye', role: 'User', joined: '2024-11-10' },
  { id: 2, name: 'Kwame Owusu', role: 'Manager', joined: '2025-01-03' },
];

const dummyPayments = [
  { id: 1, user: 'Ama Boakye', item: 'Shea Butter Class', amount: '₵100', status: 'Paid' },
  { id: 2, user: 'Kwame Owusu', item: 'Soap Workshop', amount: '₵200', status: 'Pending' },
];

const dummyClasses = [
  { id: 1, title: 'Shea Butter Masterclass', type: 'Online', location: '-', status: 'Active' },
  { id: 2, title: 'Skincare Workshop Accra', type: 'In-Person', location: 'Accra', status: 'Upcoming' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Users');

  const tabs = [
    'Users',
    'Payments',
    'Classes',
    'Admin Profile',
    'Analytics',
    'Stories and Testimonial'
    
  ];

  return (
    <DashboardLayout >
        <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
      <div className="flex h-screen">
          <aside className="w-64 bg-white shadow-md p-4 space-y-2">
    <h2 className="text-lg font-bold mb-4 text-gray-800">Admin</h2>
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium ${
          activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </aside>
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
  {activeTab === 'Users' && <UserManager Users={dummyUsers}/> }
  {activeTab === 'Payments' && <PaymentReports Payments={dummyPayments}/> }
  {activeTab === 'Classes' && <AdminCourseManager Classes={dummyClasses}/> }
  {activeTab === 'Admin Profile' && <AdminProfile/>}
   {activeTab === 'Analytics' && <DashboardAnalytics  />}
   {activeTab === 'Stories and Testimonial' && <UserStoriesModeration/>}
</main>
      
      </div>
      </motion.div>
    </DashboardLayout>
  );
}
