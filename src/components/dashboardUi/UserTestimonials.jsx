import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../lib/api";
import { motion } from "framer-motion";

export default function UserTestimonials() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await api.get("/api/stories/mine", { headers: authHeaders() });
        setStories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        // fallback dummy
        setStories([
          {
            id: "s1",
            name: "You",
            subtitle: "Workshop",
            text: "I loved making shea butter!",
            rating: 5,
            image: "/images/soap2.jpg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
  }, []);

  if (loading) return <div className="py-8 text-center">Loading your stories…</div>;

  if (!stories.length) return <div className="py-8 text-center text-gray-500">No stories yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stories.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex gap-3">
            <img src={s.image || "/images/soap2.jpg"} alt={s.name} className="w-20 h-20 object-cover rounded" />
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-400">{s.subtitle}</div>
              <div className="text-sm mt-2">{s.text}</div>
              <div className="text-sm text-yellow-500 mt-2">{"★".repeat(s.rating || 5)}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
