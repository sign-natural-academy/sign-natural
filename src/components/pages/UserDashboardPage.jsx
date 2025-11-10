// src/components/pages/UserDashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../dashboardUi/DashboardLayout";
import TutorialGrid from "../dashboardUi/TutorialGrid";
import BookingGrid from "../dashboard/user/BookingGrid";
import StoryForm from "../dashboardUi/StoryForm";
import UserTestimonials from "../dashboardUi/UserTestimonials";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

// ⬇ NEW: real Overview (keeps architecture; just a component swap)
import Overview from "../dashboard/user/Overview";

const TAB_DEFAULT = "overview";
const USER_TABS = [
  { key: "overview", label: "Overview" },
  { key: "tutorials", label: "Free Tutorials" },
  { key: "bookings", label: "My Bookings" },
  { key: "post", label: "Post a Story" },
  { key: "stories", label: "My Stories" },
  { key: "profile", label: "User Profile" },
  { key: "settings", label: "Settings" },
];

export default function UserDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryTab = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("tab") || TAB_DEFAULT;
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(queryTab);

  useEffect(() => setActiveTab(queryTab), [queryTab]);

  const goToTab = (key) => {
    navigate(`/user-dashboard?tab=${encodeURIComponent(key)}`, { replace: false });
    setActiveTab(key);
  };

  const TabContent = useMemo(() => {
    return {
      //  Swap the placeholder grid for the real Overview component
      overview: () => <Overview />,

      tutorials: () => <TutorialGrid />,
      bookings: () => <BookingGrid />,
      post: () => <StoryForm />,
      stories: () => <UserTestimonials />,
      profile: () => <div className="text-gray-600">Profile coming soon.</div>,
      settings: () => <div className="text-gray-600">Settings coming soon.</div>,
    }[activeTab] || (() => <div className="text-gray-600">Select an item from the menu.</div>);
  }, [activeTab]);

  const ActiveComponent = TabContent;

  return (
    <DashboardLayout title="My Dashboard">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold capitalize">
              {USER_TABS.find((t) => t.key === activeTab)?.label || "Overview"}
            </h2>
            <div className="text-sm text-gray-500">User controls</div>
          </div>
          <div className="min-h-60">
            <ActiveComponent />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}