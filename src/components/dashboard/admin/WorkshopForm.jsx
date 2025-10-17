// src/components/dashboard/admin/WorkshopForm.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";

/**
 * WorkshopForm: create / edit workshop
 */
export default function WorkshopForm({ workshop = null, onSaved = () => {}, onCancel = () => {} }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "celebration",
    location: "Accra",
    dateTime: "",
    duration: "",
    capacity: 10,
    price: "",
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (workshop) {
      setForm({
        title: workshop.title || "",
        description: workshop.description || "",
        type: workshop.type || "celebration",
        location: workshop.location || "Accra",
        dateTime: workshop.dateTime || "",
        duration: workshop.duration || "",
        capacity: workshop.capacity ?? 10,
        price: workshop.price || "",
      });
    }
  }, [workshop]);

  const onFile = (e) => setFile(e.target.files[0]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (file) fd.append("image", file);

      if (workshop && workshop.id) {
        await api.put(`/api/workshops/${workshop.id}`, fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
        setMsg("Workshop updated.");
      } else {
        await api.post("/api/workshops", fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
        setMsg("Workshop created.");
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setMsg("Failed to save workshop.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm block mb-1">Title</label>
        <input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div>
        <label className="text-sm block mb-1">Description</label>
        <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full border px-3 py-2 rounded h-28" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})} className="border px-3 py-2 rounded">
          <option value="celebration">Celebration</option>
          <option value="diasporan">Diasporan</option>
          <option value="group">Group</option>
        </select>
        <input placeholder="Location" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} className="border px-3 py-2 rounded" />
        <input type="datetime-local" value={form.dateTime} onChange={(e)=>setForm({...form, dateTime:e.target.value})} className="border px-3 py-2 rounded" />
        <input placeholder="Duration (e.g. 90 mins)" value={form.duration} onChange={(e)=>setForm({...form, duration:e.target.value})} className="border px-3 py-2 rounded" />
        <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e)=>setForm({...form, capacity:parseInt(e.target.value||0)})} className="border px-3 py-2 rounded" />
        <input placeholder="Price" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} className="border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="text-sm block mb-1">Image (optional)</label>
        <input type="file" accept="image/*" onChange={onFile} />
      </div>

      {msg && <div className="text-sm text-gray-600">{msg}</div>}

      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="px-4 py-2 bg-[#7d4c35] text-white rounded">{busy ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
