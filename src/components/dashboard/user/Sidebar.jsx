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
  PencilIcon,
} from "@heroicons/react/24/outline";
import SidebarShell from "../../dashboardUi/shared/SidebarShell";
import { getActiveKey } from "../../dashboardUi/shared/navUtils";

export default function Sidebar({ open = false, onClose = () => {} }) {
  const location = useLocation();
  const active = getActiveKey(location, "overview");

  const nav = [
    { key: "overview", label: "Overview", to: "/user-dashboard", icon: HomeIcon },
    { key: "free-tutorials", label: "Free Tutorials", to: "/user-dashboard?tab=tutorials", icon: BookOpenIcon },
    { key: "my-bookings", label: "My Bookings", to: "/user-dashboard?tab=bookings", icon: CalendarIcon },
    { key: "post", label: "Post a Story", to: "/user-dashboard?tab=post", icon: PencilIcon },

    { key: "my-stories", label: "My Stories", to: "/user-dashboard?tab=stories", icon: PhotoIcon },
    { key: "profile", label: "Profile", to: "/user-dashboard?tab=profile", icon: UserCircleIcon },
    { key: "settings", label: "Settings", to: "/user-dashboard?tab=settings", icon: Cog6ToothIcon },
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
