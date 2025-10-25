// src/components/ui/NotificationBell.jsx
import React, { useEffect, useRef, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

function timeAgo(iso) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  } catch {
    return "";
  }
}

/**
 * Props:
 * - items: [{ id, title, body, at, read, kind }]
 * - unread: number
 * - onOpen(): void
 * - onClose(): void
 * - markAllRead(): void
 * - className?: string
 */
export default function NotificationBell({
  items = [],
  unread = 0,
  markAllRead,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = () => setOpen((v) => !v);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <button
        onClick={toggle}
        className="relative p-2 rounded hover:bg-gray-100"
        aria-label="Notifications"
      >
        <BellIcon className="w-6 h-6 text-gray-700" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="text-sm font-semibold">Notifications</div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-auto">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No notifications</div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`px-3 py-2 border-b last:border-b-0 ${!n.read ? "bg-blue-50" : ""}`}
                >
                  <div className="text-sm font-medium">{n.title}</div>
                  {n.body && <div className="text-xs text-gray-600 mt-0.5">{n.body}</div>}
                  <div className="text-[11px] text-gray-400 mt-1">{timeAgo(n.at)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
