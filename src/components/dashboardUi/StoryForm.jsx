import React, { useState } from "react";

export default function StoryForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [image, setImage] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const payload = { title, story, image };
    onSubmit?.(payload);
    setTitle("");
    setStory("");
    setImage(null);
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" className="w-full border px-3 py-2 rounded" />
      <textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Your story" className="w-full border px-3 py-2 rounded" rows={4} />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Share</button>
    </form>
  );
}
