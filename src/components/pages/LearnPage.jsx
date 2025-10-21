// src/components/pages/LearnPage.jsx
import React, { useEffect, useState } from "react";
import CourseCard from "../ui/CourseCard";
import Filters from "../ui/Filters";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import CourseDetailsModal from "../ui/CourseDetailsModal";
import { getCourses } from "../../api/services/courses";

export default function LearnPage() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDetails = (id) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedId(null);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (filter !== "all") params.type = filter;
        const res = await getCourses(params);
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-screen-lg mx-auto pt-28">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">Skincare School</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            From free tutorials to masterclasses — pick what suits you.
          </p>
        </div>

        <Filters currentFilter={filter} onFilterChange={setFilter} />

        {loading ? (
          <div className="py-10 text-center">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} onView={openDetails} />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Modal */}
      <CourseDetailsModal
        open={detailsOpen}
        onClose={closeDetails}
        courseId={selectedId}
      />
    </>
  );
}
