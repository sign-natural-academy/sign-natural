// src/components/ui/NotificationBell.jsx
import React, { useEffect, useRef, useState } from "react";
import { BellIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function fmtAgo(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleString();
}

function TypeBadge({ type }) {
  const map = {
    testimonial_pending_created: { label: "New Story", cls: "bg-amber-100 text-amber-800" },
    testimonial_approved:        { label: "Story Approved", cls: "bg-green-100 text-green-800" },
    testimonial_deleted:         { label: "Story Deleted", cls: "bg-red-100 text-red-800" },
    new_booking:                 { label: "Booking", cls: "bg-blue-100 text-blue-800" },
    booking_updated:             { label: "Booking Update", cls: "bg-purple-100 text-purple-800" },
    booking_status:              { label: "Booking Update", cls: "bg-purple-100 text-purple-800" },
  };
  const m = map[type] || { label: type || "Notice", cls: "bg-gray-100 text-gray-800" };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>;
}

/**
 * NotificationBell
 * - items: array of notifications
 * - unread: number
 * - markAllRead: function
 * - onItemClick: optional callback(notification) => void
 *
 * If onItemClick is provided the component will call it when a notification is clicked.
 * The component keeps the <a href> fallback for accessibility / non-JS scenarios.
 */
export default function NotificationBell({
  items = [],
  unread = 0,
  markAllRead = () => {},
  onItemClick = null
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const list = Array.isArray(items) ? [...items] : [];

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  // Close on outside click & on Esc
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const t = e.target;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // helper: when user clicks the anchor, prevent default and let onItemClick handle navigation
  const anchorClickHandler = (e, n) => {
    if (onItemClick) {
      e.preventDefault();
      onItemClick(n);
    }
    // else let anchor behave normally (fallback)
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="relative p-2 rounded hover:bg-gray-100 focus:outline-none"
        aria-label="Notifications"
      >
        <BellIcon className="w-5 h-5 text-gray-700" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold bg-red-600 text-white rounded-full">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="text-sm font-semibold">Notifications</div>
            {unread > 0 && (
              <button
                onClick={() => { markAllRead?.(); }}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-auto">
            {list.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              <ul className="divide-y">
                {list.map((n, idx) => {
                  const type = n?.type || "";
                  const msg  = n?.message || n?.title || "(no message)";
                  const link = n?.link || "";
                  const time = n?.createdAt || n?.created_at || null;

                  return (
                    <li
                      key={idx}
                      className="px-3 py-3 hover:bg-gray-50"
                      // call onItemClick for clicks that are not directly on the anchor; anchor handles its own click
                      onClick={() => { if (!link && onItemClick) onItemClick(n); }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <TypeBadge type={type} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800">{msg}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{fmtAgo(time)}</div>
                        </div>
                        {link ? (
                          <a
                            href={link}
                            onClick={(e) => anchorClickHandler(e, n)}
                            className="shrink-0 p-1 text-gray-500 hover:text-gray-700"
                            title="Open"
                          >
                            <ChevronRightIcon className="w-4 h-4" />
                          </a>
                        ) : (
                          // keep visual affordance for non-link items
                          <div className="shrink-0 p-1 text-gray-300">
                            <ChevronRightIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-3 py-2 border-t text-right">
            <button onClick={close} className="text-xs text-gray-600 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
