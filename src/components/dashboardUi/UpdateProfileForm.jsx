import React, { useState } from "react";

export default function UpdateProfileForm({ initial = {}, onSave }) {
  const [form, setForm] = useState({ name: initial.name || "", email: initial.email || "" });

  const submit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
      <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="w-full border px-3 py-2 rounded" />
      <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full border px-3 py-2 rounded" />
      <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
