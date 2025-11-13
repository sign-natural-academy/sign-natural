// src/components/dashboardUi/StoryForm.jsx
import React, { useState } from "react";
import { createTestimonial } from "../../api/services/testimonials";

const CATEGORY_OPTIONS = [
  { value: "", label: "Select category (optional)" },
  { value: "classes", label: "Classes" },
  { value: "workshops", label: "Workshops" },
  { value: "products", label: "Products" },
];

export default function StoryForm() {
  const [form, setForm] = useState({
    text: "",
    tag: "",
    image: null,
    rating: "5", // <-- add this
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const reset = () => {
    setForm({ text: "", tag: "", image: null, rating: "5" });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("text", form.text);
      if (form.tag) fd.append("tag", form.tag);
      if (form.image) fd.append("image", form.image);
      if (form.rating) fd.append("rating", String(form.rating)); // <-- include

      await createTestimonial(fd);
      setMsg("✅ Story submitted! It will appear publicly once approved by an admin.");
      reset();
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || "❌ Failed to submit story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold"></h3>

      {/* Category (maps to tag) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="w-32 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
        >
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
        </select>
      </div>

      {/* Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your story</label>
        <textarea
          name="text"
          value={form.text}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your experience…"
          required
          className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* Image (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="file:mr-4 file:rounded-full file:text-white file:border-0 file:bg-green-600 file:px-4 file:py-2"
        />
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded border" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit Story"}
        </button>
        <button type="button" onClick={reset} className="text-sm text-gray-600 hover:underline">
          Reset
        </button>
      </div>

      {msg && <div className="text-sm mt-2">{msg}</div>}
      <p className="text-xs text-gray-500">Note: Admin approval is required before your story appears publicly.</p>
    </form>
  );
}
