import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getWorkshop } from "../../api/services/workshops";

export default function WorkshopDetailsModal({ open, onClose, workshopId }) {
  const [loading, setLoading] = useState(false);
  const [workshop, setWorkshop] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      if (!open || !workshopId) return;
      setLoading(true);
      setError("");
      try {
        const res = await getWorkshop(workshopId);
        if (active) setWorkshop(res.data);
      } catch (e) {
        if (active) setError(e?.response?.data?.message || "Failed to load workshop");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [open, workshopId]);

  return (
    <AnimatePresence>
      {open && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Workshop details</h3>
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {loading && <div className="p-6">Loading…</div>}
            {!loading && error && <div className="p-6 text-red-600">{error}</div>}

            {!loading && !error && workshop && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-5">
                  <img
                    src={workshop.image || "/images/soap2.jpg"}
                    alt={workshop.title}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                </div>

                <div className="p-5 space-y-2">
                  <h2 className="text-xl font-semibold">{workshop.title}</h2>

                  <div className="text-sm text-gray-500">
                    {workshop.location ? `${workshop.location} • ` : ""}
                    {(workshop.type || "workshop").toUpperCase()}
                  </div>

                  {workshop.duration && (
                    <div className="text-sm text-gray-600">⏱ Duration: {workshop.duration}</div>
                  )}
                  {workshop.participants && (
                    <div className="text-sm text-gray-600">
                      👥 Participants: {workshop.participants}
                    </div>
                  )}

                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {workshop.description || "No description provided."}
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {typeof workshop.price === "number" && workshop.price > 0
                        ? `₵${workshop.price}`
                        : "Free"}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="/signup"
                        className="px-4 py-2 rounded bg-[#455f30] text-white text-sm"
                      >
                        Book / Enroll
                      </a>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
