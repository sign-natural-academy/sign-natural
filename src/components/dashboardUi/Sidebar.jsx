// src/components/dashboardUi/Sidebar.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  PhotoIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import SidebarShell from "./shared/SidebarShell";
import { getActiveKey } from "./shared/navUtils";

export default function Sidebar({ open = false, onClose = () => {} }) {
  const location = useLocation();
  const active = getActiveKey(location, "overview");

  const nav = [
    { key: "overview", label: "Overview", to: "/user-dashboard", icon: HomeIcon },
    { key: "free-tutorials", label: "Free Tutorials", to: "/user-dashboard?tab=Free%20Tutorials", icon: BookOpenIcon },
    { key: "my-bookings", label: "My Bookings", to: "/user-dashboard?tab=My%20Bookings", icon: CalendarIcon },
    { key: "my-stories", label: "My Stories", to: "/user-dashboard?tab=Post%20a%20Story", icon: PhotoIcon },
    { key: "profile", label: "Profile", to: "/user-dashboard?tab=User%20Profile", icon: UserCircleIcon },
    { key: "settings", label: "Settings", to: "/user-dashboard?tab=Settings", icon: Cog6ToothIcon },
    { key: "help", label: "Help", to: "/support", icon: QuestionMarkCircleIcon },
  ];

  return (
    <SidebarShell
      open={open}
      onClose={onClose}
      navItems={nav}
      activeKey={active}
      sectionLabel="User menu"
      widthClass="lg:w-64"
    />
  );
}
