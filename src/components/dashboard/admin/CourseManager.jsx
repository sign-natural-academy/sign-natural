// src/components/dashboard/admin/CourseManager.jsx
import React, { useEffect, useState } from "react";
import { getCourses, deleteCourse } from "../../../api/services/courses";
import CourseForm from "./CourseForm";

// Optional: if you installed react-hot-toast. If not, the code still works.
let toast;
try {
  // lazy import to avoid hard dependency
  // eslint-disable-next-line global-require
  toast = require("react-hot-toast").toast;
} catch (_) {
  toast = { success: console.log, error: console.error, loading: console.log, dismiss: () => {} };
}

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null); // null = nothing, {} = create, obj = edit
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
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    setDeletingId(id);
    const tId = toast.loading("Deleting course…");
    try {
      await deleteCourse(id);
      toast.success("Course deleted", { id: tId });
      await loadCourses();
      // If the deleted one was being edited, close the form
      if (selected && selected._id === id) setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed", { id: tId });
    } finally {
      setDeletingId(null);
    }
  };

  const isCreating = selected && !selected._id;
  const isEditing = selected && !!selected._id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: list */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Courses</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={loadCourses}
              disabled={loading}
              className="px-3 py-1 border rounded disabled:opacity-60"
              title="Refresh list"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              onClick={() => setSelected({})}
              className="px-3 py-1 bg-green-700 text-white rounded"
            >
              + New Course
            </button>
          </div>
        </div>

        {/* List */}
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
              <li key={c._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={c.image || "/images/placeholder.jpg"}
                    alt={c.title}
                    className="w-16 h-10 object-cover rounded border"
                  />
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-gray-500">
                      {c.type} • {c.duration || "—"} • {c.price > 0 ? `₵${c.price}` : "Free"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelected(c)}
                    className="px-3 py-1 text-sm border rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded disabled:opacity-60"
                    disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT: form panel */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {isEditing ? "Edit Course" : isCreating ? "Create Course" : "Create / Edit"}
          </h3>
          {selected && (
            <button onClick={() => setSelected(null)} className="text-sm underline">
              Close
            </button>
          )}
        </div>

        {/* Render the form only when creating/editing */}
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
  );
}
