import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboardUi/DashboardLayout";
import TutorialGrid from "../dashboardUi/TutorialGrid";
import BookingGrid from "../dashboardUi/BookingGrid";
import StoryForm from "../dashboardUi/StoryForm";
import UserTestimonials from "../dashboardUi/UserTestimonials";
// import { Card } from "../ui/placeholder"; // optional - if you have shared card component

export default function UserDashboardPage() {
  const tabs = ["Free Tutorials", "My Bookings", "Post a Story", "My Stories"];
  const [active, setActive] = useState("Free Tutorials");

  useEffect(() => {
    // read query param to pre-select a tab if provided
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && tabs.includes(tab)) setActive(tab);
  }, []);

  return (
    <DashboardLayout title="My Dashboard">
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Tutorials</div>
          <div className="text-2xl font-semibold">12</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Your Bookings</div>
          <div className="text-2xl font-semibold">3</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Stories Shared</div>
          <div className="text-2xl font-semibold">1</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                active === t ? "bg-green-700 text-white" : "bg-white border text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {active === "Free Tutorials" && <TutorialGrid />}
          {active === "My Bookings" && <BookingGrid />}
          {active === "Post a Story" && <StoryForm />}
          {active === "My Stories" && <UserTestimonials />}
        </div>
      </div>
    </DashboardLayout>
  );
}
