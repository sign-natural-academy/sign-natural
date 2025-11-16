// src/components/pages/UserDashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../dashboardUi/DashboardLayout";
import TutorialGrid from "../dashboardUi/TutorialGrid";
import BookingGrid from "../dashboard/user/BookingGrid";
import StoryForm from "../dashboardUi/StoryForm";
import UserTestimonials from "../dashboardUi/UserTestimonials";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../dashboard/user/Profile";
import Settings from "../dashboard/user/Settings";

import Overview from "../dashboard/user/Overview";
import Help from "../dashboard/user/Help";

const TAB_DEFAULT = "overview";
const USER_TABS = [
  { key: "overview", label: "Overview" },
  { key: "tutorials", label: "Free Tutorials" },
  { key: "bookings", label: "My Bookings" },
  { key: "post", label: "Post a Story" },
  { key: "stories", label: "My Stories" },
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
  {key:"help",label:"Help"}
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
      profile: () => <Profile />,
      settings: () => <Settings />,
       help: () => <Help />,
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