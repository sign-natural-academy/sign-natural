// src/components/dashboard/admin/CourseManager.jsx
import React, { useEffect, useState } from "react";
import { getCourses, deleteCourse } from "../../../api/services/courses";
import CourseForm from "./CourseForm";
import ListItemCard from "./common/ListItemCard";

let toast;
try {
  toast = require("react-hot-toast").toast;
} catch (_) {
  toast = { success: console.log, error: console.error, loading: console.log, dismiss: () => {} };
}

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses();
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading courses:", err);
      toast.error(err?.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    setDeletingId(id);
    const tId = toast.loading("Deleting course…");
    try {
      await deleteCourse(id);
      toast.success("Course deleted", { id: tId });
      await loadCourses();
      if (selected && selected._id === id) setSelected(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed", { id: tId });
    } finally {
      setDeletingId(null);
    }
  };

  const isCreating = selected && !selected._id;
  const isEditing = selected && !!selected._id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: course list */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3 gap-3">
          <h3 className="font-semibold text-lg truncate"></h3>

          {/* On small screens buttons stack; on larger screens inline */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={loadCourses}
              disabled={loading}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-60 text-sm"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              onClick={() => setSelected({})}
              className="w-full sm:w-auto px-3 py-1 bg-green-700 text-white rounded text-sm"
            >
              + New Course
            </button>
          </div>
        </div>

        {/* Keep list scrollable on small screens so the form below stays reachable */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="space-y-2">
              <div className="h-10 bg-gray-100 animate-pulse rounded" />
              <div className="h-10 bg-gray-100 animate-pulse rounded" />
              <div className="h-10 bg-gray-100 animate-pulse rounded" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-gray-500 py-6 text-center">No courses found.</div>
          ) : (
            <ul className="divide-y">
              {courses.map((c) => (
                <ListItemCard
                  key={c._id}
                  item={{
                    ...c,
                    meta: `${c.type || "—"} • ${c.duration || "—"} • ${
                      c.price > 0 ? `₵${c.price}` : "Free"
                    }`,
                  }}
                  onEdit={setSelected}
                  onDelete={handleDelete}
                  deleting={deletingId === c._id}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right: create/edit form */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base sm:text-lg">
            {isEditing ? "Edit Course" : isCreating ? "Create Course" : "Create / Edit"}
          </h3>
          {selected && (
            <button onClick={() => setSelected(null)} className="text-sm underline">
              Close
            </button>
          )}
        </div>

        <div>
          {selected ? (
            <CourseForm
              selected={selected}
              onSuccess={async () => {
                setSelected(null);
                await loadCourses();
              }}
              onCancel={() => setSelected(null)}
            />
          ) : (
            <div className="text-gray-500 text-sm">
              Select a course to edit or click <span className="font-medium">“New Course”</span> to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
