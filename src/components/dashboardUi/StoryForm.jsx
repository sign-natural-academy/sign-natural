import React, { useState } from "react";
import api, { authHeaders } from "../../lib/api";
import { motion } from "framer-motion";

export default function StoryForm() {
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    text: "",
    rating: 5,
    tag: "My Creation",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const onFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!form.name || !form.text) {
      setMsg("Please add your name and story.");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("subtitle", form.subtitle);
    fd.append("text", form.text);
    fd.append("rating", form.rating);
    fd.append("tag", form.tag);
    if (file) fd.append("image", file);

    setBusy(true);
    try {
      await api.post("/api/stories", fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      setMsg("Story submitted. Thank you!");
      setForm({ name: "", subtitle: "", text: "", rating: 5, tag: "My Creation" });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMsg("Failed to submit. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">Share what you made</h3>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Your name"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        value={form.subtitle}
        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        placeholder="Subtitle (e.g. Workshop name)"
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        placeholder="Tell us about your experience"
        className="w-full border px-3 py-2 rounded h-24"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm">Rating</label>
        <input
          type="range"
          min="1"
          max="5"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        />
        <div className="text-sm font-medium">{form.rating}</div>
      </div>

      <div>
        <label className="block text-sm mb-1">Photo (optional)</label>
        <input type="file" accept="image/*" onChange={onFile} />
        {preview && <img src={preview} alt="preview" className="w-32 mt-2 rounded" />}
      </div>

      <div className="flex items-center gap-2">
        <button disabled={busy} className="px-4 py-2 bg-green-700 text-white rounded">
          {busy ? "Submitting…" : "Submit Story"}
        </button>
        {msg && <div className="text-sm text-gray-600">{msg}</div>}
      </div>
    </motion.form>
  );
}
