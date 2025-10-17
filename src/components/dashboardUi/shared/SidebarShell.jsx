// src/components/dashboardUi/shared/SidebarShell.jsx
import React from "react";
import TabLink from "./TabLink";

export default function SidebarShell({
  open = false,
  onClose = () => {},
  navItems = [],
  activeKey = "overview",
  sectionLabel = "Navigation",
  logoSrc = "/logo2.png",
  footer = { name: "You", role: "Member", avatar: "/avatar-placeholder.png" },
  widthClass = "lg:w-72", // allow 64 or 72, etc.
}) {
  const NavList = ({ onItemClick }) => (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <TabLink
          key={item.key}
          to={item.to}
          icon={item.icon}
          label={item.label}
          active={activeKey === item.key}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );

  const Desktop = (
    <aside className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex ${widthClass} lg:flex-col bg-white border-r`}>
      <div className="flex h-16 items-center px-6">
        <img src={logoSrc} alt="Logo" className="h-10 w-auto" />
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6 text-xs text-gray-500">{sectionLabel}</div>
        <NavList />
      </div>

      <div className="p-4 border-t">
        <div className="text-xs text-gray-500 mb-2">Signed in as</div>
        <div className="flex items-center gap-3">
          <img src={footer.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold">{footer.name}</div>
            <div className="text-xs text-gray-400">{footer.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );

  const Mobile = open ? (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <img src={logoSrc} alt="logo" className="h-8" />
          <button onClick={onClose} className="text-gray-700">✖</button>
        </div>

        <NavList onItemClick={onClose} />

        <div className="mt-6 border-t pt-4 text-sm text-gray-500">
          <div className="mb-2">Signed in as</div>
          <div className="flex items-center gap-3">
            <img src={footer.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold">{footer.name}</div>
              <div className="text-xs">{footer.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  ) : null;

  return (
    <>
      {Desktop}
      {Mobile}
    </>
  );
}
