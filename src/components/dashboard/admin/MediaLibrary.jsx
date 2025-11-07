// src/components/dashboard/admin/MediaLibrary.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listMedia, uploadMedia, deleteMedia } from "../../../api/services/media";

const PAGE_LIMIT = 24;

export default function MediaLibrary() {
  const [folder, setFolder] = useState("signnatural");
  const [q, setQ] = useState("");
  const [page] = useState(1); // using first page (Cloudinary cursor-based). Keep simple for now.
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // { url, public_id }

  const query = useMemo(() => ({ folder, q, page, limit: PAGE_LIMIT }), [folder, q, page]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setError(""); setMsg("");
      try {
        const res = await listMedia(query);
        if (!alive) return;
        const data = res.data || {};
        setItems(data.items || []);
        setTotal(data.total || 0);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load media.");
        setItems([]); setTotal(0);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [query]);

  const doUpload = async () => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder || "signnatural/misc");

      const res = await uploadMedia(fd);
      const uploaded = res.data;
      setItems(arr => [uploaded, ...arr]);
      setFile(null);
      setMsg("Uploaded.");
    } catch (e) {
      console.error(e);
      setMsg("Upload failed.");
    }
  };

  const doDelete = async (public_id, force = false) => {
    try {
      await deleteMedia(public_id, { force });
      setItems(arr => arr.filter(i => i.public_id !== public_id));
      setMsg("Deleted.");
      if (preview?.public_id === public_id) setPreview(null);
    } catch (e) {
      // 409 means “in-use”
      if (e?.response?.status === 409) {
        setMsg("Asset is in use. Delete blocked. Use Force Delete to override.");
      } else {
        setMsg("Delete failed.");
      }
      console.error(e);
    }
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

  return (
    <div className="space-y-4">
      {/* Header / actions */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Media Library</h2>
          <p className="text-xs text-gray-500">Upload, browse, and manage images.</p>
        </div>
        <div className="bg-white rounded shadow p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
          <select
            className="border px-3 py-2 rounded text-sm"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          >
            {folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <input
            className="border px-3 py-2 rounded text-sm"
            placeholder="Search filename/public_id…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="border px-3 py-2 rounded text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-[#7d4c35] text-white rounded text-sm disabled:opacity-50"
              disabled={!file}
              onClick={doUpload}
            >
              Upload
            </button>
            <button
              className="px-3 py-2 border rounded text-sm"
              onClick={() => { setQ(""); setFile(null); setMsg(""); }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-sm text-gray-600">
        {loading ? "Loading…" : `${total} items`}
        {msg && <span className="ml-3 text-green-700">{msg}</span>}
        {error && <span className="ml-3 text-red-600">{error}</span>}
      </div>

      {/* Grid */}
      <div className="bg-white rounded shadow p-3">
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
                onClick={() => setPreview({ url: m.secure_url, public_id: m.public_id })}
                title={m.public_id}
              >
                <img
                  src={m.secure_url}
                  alt={m.public_id}
                  className="w-full h-28 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                  {m.public_id}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreview(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow max-w-3xl w-full overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="font-semibold text-sm truncate">{preview.public_id}</div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border rounded text-sm"
                    onClick={() => doDelete(preview.public_id, false)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-3 py-1 border rounded text-sm"
                    onClick={() => doDelete(preview.public_id, true)}
                    title="Bypass in-use guard"
                  >
                    Force Delete
                  </button>
                  <button className="px-3 py-1 border rounded text-sm" onClick={() => setPreview(null)}>
                    Close
                  </button>
                </div>
              </div>
              <div className="p-3">
                <img src={preview.url} alt="preview" className="w-full max-h-[70vh] object-contain" />
                <div className="mt-2 text-xs text-gray-600 wrap-break-words">{preview.public_id}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
