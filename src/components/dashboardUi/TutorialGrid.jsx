//src/components/dashboardUi/TutorialGrid.jsx

import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { motion } from "framer-motion";
import { PlayIcon } from "@heroicons/react/24/outline";

export default function TutorialGrid({ initial = [] }) {
  const [tutorials, setTutorials] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    // try to fetch live tutorials; fall back to initial/dummy
    const fetchTutorials = async () => {
      try {
        const res = await api.get("/api/tutorials");
        setTutorials(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // keep initial (passed from parent) if any
        if (!initial || initial.length === 0) {
          setTutorials([
            {
              id: "t1",
              title: "How to Make Herbal Soap",
              description: "Beginner-friendly soap making tutorial.",
              url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
              image: "/body.jpg",
              duration: "12:34",
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  if (loading) {
    return <div className="py-8 text-center">Loading tutorials…</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutorials.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-lg shadow p-4 flex flex-col"
        >
          <div className="relative">
            <img
              src={t.image || "/body.jpg"}
              alt={t.title}
              className="w-full h-44 object-cover rounded"
            />
            <button
              onClick={() => setPlaying(playing === t.id ? null : t.id)}
              className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow"
              aria-label="Play"
            >
              <PlayIcon className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          <div className="mt-3 flex-1">
            <h3 className="font-semibold text-gray-800">{t.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{t.description}</p>
            <p className="text-xs text-gray-400 mt-2">⏱ {t.duration || "—"}</p>
          </div>

          {playing === t.id && (
            <div className="mt-3">
              <video
                controls
                src={t.url}
                className="w-full h-48 rounded bg-black"
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
