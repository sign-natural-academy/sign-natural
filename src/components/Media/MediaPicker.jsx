// src/components/media/MediaPicker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listMedia, uploadMedia } from "../../api/services/media";

export default function MediaPicker({
  open = false,
  onClose = () => {},
  onSelect = () => {},
  initialFolder = "signnatural",
}) {
  const [folder, setFolder] = useState(initialFolder);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);

  const query = useMemo(() => ({ folder, q, page: 1, limit: 30 }), [folder, q]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await listMedia(query);
        if (!alive) return;
        setItems(res.data?.items ?? []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, query]);

  const doUpload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder || "signnatural/misc");
    const res = await uploadMedia(fd);
    const uploaded = res.data;
    setItems((arr) => [uploaded, ...arr]);
    setFile(null);
    setMsg("Uploaded.");
  };

  const folders = [
    "signnatural",
    "signnatural/courses",
    "signnatural/workshops",
    "signnatural/products",
    "signnatural/testimonials",
    "signnatural/logos",
    "signnatural/misc",
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded shadow max-w-5xl w-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold">Select Media</div>
            <button className="px-3 py-1 border rounded text-sm" onClick={onClose}>Close</button>
          </div>

          <div className="p-3 border-b grid grid-cols-1 md:grid-cols-4 gap-2">
            <select className="border px-3 py-2 rounded text-sm" value={folder} onChange={(e) => setFolder(e.target.value)}>
              {folders.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <input
              className="border px-3 py-2 rounded text-sm md:col-span-2"
              placeholder="Search filename/public_id…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="flex gap-2">
              <input type="file" accept="image/*" className="border px-3 py-2 rounded text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button disabled={!file} onClick={doUpload} className="px-3 py-2 bg-[#7d4c35] text-white rounded text-sm disabled:opacity-50">
                Upload
              </button>
            </div>
          </div>

          <div className="px-4 py-2 text-sm text-gray-600">
            {loading ? "Loading…" : `${items.length} items`}
            {msg && <span className="ml-3 text-green-700">{msg}</span>}
          </div>

          <div className="p-3">
            {loading ? (
              <div className="py-10 text-center">Loading…</div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center text-gray-500">No media found.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                {items.map((m) => (
                  <button
                    key={m.public_id}
                    className="group relative border rounded overflow-hidden bg-gray-50 hover:shadow"
                    onClick={() => { onSelect(m); onClose(); }}
                    title={m.public_id}
                  >
                    <img src={m.secure_url} alt={m.public_id} className="w-full h-28 object-cover" loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                      {m.public_id}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
