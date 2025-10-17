// src/components/dashboard/admin/CourseManager.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import CourseForm from "./CourseForm";
import ConfirmModal from "../../dashboardUi/ConfirmModal";

/**
 * CourseManager - list courses, create/edit/delete
 */
export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // course object or null
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/courses", { headers: authHeaders() });
      setCourses(Array.isArray(res.data) ? res.data : res.data?.courses ?? []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setCourses([
        { id: "c-1", title: "Shea Butter Basics", description: "Learn the fundamentals", price: "Free", duration: "45 mins", image: "/body.jpg", type: "free" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setShowForm(true); };

  const handleSaved = () => {
    setShowForm(false);
    load();
  };

  const confirmDelete = (id) => setConfirm({ open: true, id });
  const cancelDelete = () => setConfirm({ open: false, id: null });

  const doDelete = async () => {
    const id = confirm.id;
    if (!id) return;
    try {
      await api.delete(`/api/courses/${id}`, { headers: authHeaders() });
      setMsg("Course deleted.");
      setCourses((s) => s.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setMsg("Failed to delete.");
    } finally {
      cancelDelete();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Courses Management</h2>
        <div>
          <button onClick={openCreate} className="px-3 py-1 bg-[#7d4c35] text-white rounded">Add Course</button>
        </div>
      </div>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <CourseForm course={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading courses…</div>
      ) : courses.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No courses yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <img src={c.image || "/body.jpg"} alt={c.title} className="w-full h-36 object-cover rounded mb-3" />
              <div className="flex-1">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                <div className="mt-3 text-sm text-gray-700">⏱ {c.duration || "-" } • {c.type}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(c)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                <button onClick={() => confirmDelete(c.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={confirm.open} title="Delete course" message="Are you sure you want to delete this course?" onConfirm={doDelete} onCancel={cancelDelete} />
    </div>
  );
}
