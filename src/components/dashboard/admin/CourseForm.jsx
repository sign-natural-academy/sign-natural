// src/components/dashboard/admin/CourseForm.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";

/**
 * CourseForm - used for create and edit inside CourseManager
 * props: course (optional), onSaved callback
 */
export default function CourseForm({ course = null, onSaved = () => {}, onCancel = () => {} }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "free",
    price: "",
    duration: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || "",
        description: course.description || "",
        type: course.type || "free",
        price: course.price || "",
        duration: course.duration || "",
      });
      setPreview(course.image || null);
    }
  }, [course]);

  const onFile = (e) => {
    const f = e.target.files[0];
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("type", form.type);
      fd.append("price", form.price);
      fd.append("duration", form.duration);
      if (image) fd.append("image", image);

      if (course && course.id) {
        await api.put(`/api/courses/${course.id}`, fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
        setMsg("Course updated.");
      } else {
        await api.post("/api/courses", fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
        setMsg("Course created.");
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setMsg("Failed to save course.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm block mb-1">Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div>
        <label className="text-sm block mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border px-3 py-2 rounded h-28" required />
      </div>

      <div className="flex gap-2">
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border px-3 py-2 rounded">
          <option value="free">Free</option>
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
          <option value="on-demand">On-Demand</option>
        </select>
        <input placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} className="border px-3 py-2 rounded" />
        <input placeholder="Duration" value={form.duration} onChange={(e)=>setForm({...form,duration:e.target.value})} className="border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="text-sm block mb-1">Cover image (optional)</label>
        <input type="file" accept="image/*" onChange={onFile} />
        {preview && <img src={preview} alt="preview" className="w-32 mt-2 rounded" />}
      </div>

      {msg && <div className="text-sm text-gray-600">{msg}</div>}

      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="px-4 py-2 bg-[#7d4c35] text-white rounded">{busy ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
