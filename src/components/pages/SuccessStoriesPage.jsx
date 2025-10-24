// src/components/pages/SuccessStoriesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import FilterBar from "../ui/FilterBar";
import StoryGrid from "../ui/StoryGrid";
import ShareExperience from "../ui/ShareExperience";
import { motion } from "framer-motion";
import { getApprovedTestimonials } from "../../api/services/testimonials";

// Map free-form tags to canonical filter keys
function normalizeCategory(tag) {
  const t = String(tag || "").toLowerCase().trim();
  if (t.startsWith("workshop")) return "workshops";
  if (t.startsWith("class"))     return "classes";
  if (t.startsWith("product"))   return "products";
  return ""; // unknown -> only visible under "all"
}

function toRating(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export default function SuccessStoriesPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const res = await getApprovedTestimonials();
        const list = Array.isArray(res.data) ? res.data : [];

        const mapped = list.map((t) => ({
          id: t?._id,
          name: t?.user?.name || "Anonymous",           // populated by backend now
          subtitle: t?.tag || "",
          image: t?.imageUrl || "/images/placeholder.jpg",
          text: (t?.text || "").trim(),
          rating: toRating(t?.rating),
          _cat: normalizeCategory(t?.tag),
        }));

        if (active) setStories(mapped);
      } catch (err) {
        console.error(err);
        if (active) {
          setErrMsg(err?.response?.data?.message || "Failed to load stories.");
          setStories([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filteredStories = useMemo(() => {
    if (selectedFilter === "all") return stories;
    return stories.filter((s) => s._cat === selectedFilter);
  }, [stories, selectedFilter]);

  return (
    <>
      <Navbar />
      <div className="pt-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-gradient-to-r from-[#faf8f6] to-white py-12 text-center px-4"
        >
          <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">
            Success Stories
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Hear from our community about their experiences with our classes,
            workshops, and products.
          </p>
          <a
            href="#share"
            className="mt-4 inline-block px-4 py-2 bg-[#7d4c35] text-white rounded-full text-sm"
          >
            Share Your Story
          </a>
        </motion.div>

        <div className="p-4 max-w-screen-lg mx-auto">
          <FilterBar
            currentFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {loading ? (
            <div className="py-10 text-center">Loading stories…</div>
          ) : errMsg ? (
            <div className="py-10 text-center text-red-700">{errMsg}</div>
          ) : filteredStories.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No stories found.</div>
          ) : (
            <StoryGrid stories={filteredStories} />
          )}
        </div>

        <div id="share">
          <ShareExperience />
        </div>
      </div>
      <Footer />
    </>
  );
}
