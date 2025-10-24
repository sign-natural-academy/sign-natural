// src/components/dashboardUi/UserTestimonials.jsx
import React, { useEffect, useState } from "react";
import api from "../../lib/api";               // your axios instance
import { getUser } from "../../lib/auth";      // reads user from localStorage
import { motion } from "framer-motion";

function toRating(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function StarRating({ value = 5 }) {
  const v = toRating(value);
  return (
    <div className="flex gap-0.5" aria-label={`${v} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < v ? "fill-yellow-500" : "fill-gray-300"}`}
        >
          <path d="M10 15.27l5.18 3.05-1.64-5.81L18 8.63l-6-.23L10 3 8 8.4l-6 .23 4.46 3.88L4.82 18.3 10 15.27z" />
        </svg>
      ))}
    </div>
  );
}

export default function UserTestimonials() {
  const me = getUser(); // { _id, name, ... }
  const myId = me?._id || me?.id || null;

  const [stories, setStories] = useState([]); // normalized: { id, text, tag, imageUrl, rating, approved, createdAt }
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [notice, setNotice] = useState("");

  const normalize = (t) => ({
    id: t._id,
    text: (t.text || "").trim(),
    tag: t.tag || "",
    imageUrl: t.imageUrl || "/images/placeholder.jpg",
    rating: toRating(t.rating),
    approved: !!t.approved,
    createdAt: t.createdAt ? new Date(t.createdAt) : null,
    userId: typeof t.user === "object" ? t.user?._id || t.user?.id : t.user, // supports populated or raw ObjectId
  });

  const load = async () => {
    setLoading(true);
    setErrMsg("");
    setNotice("");

    try {
      // 1) Preferred: a dedicated "/api/testimonials/me" endpoint (protected)
      try {
        const rMe = await api.get("/api/testimonials/me");
        const listMe = Array.isArray(rMe.data) ? rMe.data : [];
        setStories(listMe.map(normalize));
        return; // success path; includes pending + approved if backend returns both
      } catch (e) {
        // continue to fallback if 404/Not implemented
        if (e?.response?.status !== 404) {
          // if it's a different error (e.g., 401), still try fallback
          // but keep the message if both fail
        }
      }

      // 2) Fallback: only approved, filter by current user id (if available)
      const rApproved = await api.get("/api/testimonials/approved");
      const approved = (Array.isArray(rApproved.data) ? rApproved.data : []).map(normalize);

      if (myId) {
        const mine = approved.filter((t) => (t.userId || "").toString() === myId.toString());
        setStories(mine);
        setNotice("Showing only your approved stories (pending items require a /api/testimonials/me endpoint).");
      } else {
        // If we can't identify the current user id, show nothing (we're in the user dashboard)
        setStories([]);
        setNotice("Could not identify user. Sign in again to see your stories.");
      }
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || "Failed to load your stories.");
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="py-8 text-center">Loading your stories…</div>;

  if (errMsg) return <div className="py-8 text-center text-red-600">{errMsg}</div>;

  if (!stories.length)
    return (
      <div className="space-y-3">
        {notice && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">{notice}</div>}
        <div className="py-8 text-center text-gray-500">You haven’t shared any stories yet.</div>
      </div>
    );

  return (
    <div className="space-y-3">
      {notice && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          {notice}
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stories.map((s) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-4 flex gap-3"
          >
            <img
              src={s.imageUrl}
              alt="story"
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating value={s.rating} />
                  {s.tag && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {s.tag}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    s.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {s.approved ? "Approved" : "Pending"}
                </span>
              </div>

              <p className="text-sm text-gray-800 mt-2 line-clamp-4">
                {s.text || "—"}
              </p>

              {s.createdAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Posted {s.createdAt.toLocaleDateString()}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
