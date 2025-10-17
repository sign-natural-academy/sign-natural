// src/components/dashboard/admin/MediaLibrary.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import ConfirmModal from "../../dashboardUi/ConfirmModal";

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/uploads", { headers: authHeaders() });
      setItems(Array.isArray(res.data) ? res.data : res.data.uploads ?? []);
    } catch (err) {
      console.error("media load:", err);
      setItems([
        { id: "m1", url: "/images/soap1.jpg", type: "image", name: "soap1.jpg", size: 10234 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onFile = (e) => setFile(e.target.files[0]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setMsg("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/api/uploads", fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
      setMsg("Uploaded.");
      // optimistic update
      setItems((s) => [res.data.upload ?? { id: Date.now().toString(), url: URL.createObjectURL(file), name: file.name }, ...s]);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMsg("Upload failed.");
    }
  };

  const confirmDelete = (id) => setConfirm({ open: true, id });
  const cancelDelete = () => setConfirm({ open: false, id: null });

  const doDelete = async () => {
    try {
      const id = confirm.id;
      await api.delete(`/api/uploads/${id}`, { headers: authHeaders() });
      setItems((s) => s.filter((x) => x.id !== id));
      setMsg("Deleted.");
    } catch (err) {
      console.error(err);
      setMsg("Delete failed.");
    } finally {
      cancelDelete();
    }
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setMsg("URL copied.");
    } catch {
      setMsg("Failed to copy.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Media Library</h2>
        <div>
          <form onSubmit={upload} className="flex items-center gap-2">
            <input type="file" onChange={onFile} accept="image/*,video/*" />
            <button type="submit" className="px-3 py-1 bg-[#7d4c35] text-white rounded">Upload</button>
          </form>
        </div>
      </div>

      {msg && <div className="text-sm mb-3 text-green-700">{msg}</div>}

      {loading ? (
        <div className="py-8 text-center">Loading media…</div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No media uploaded.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white rounded shadow p-2 flex flex-col">
              {it.type?.startsWith("image") || it.url?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={it.url} alt={it.name} className="w-full h-36 object-cover rounded" />
              ) : (
                <div className="w-full h-36 bg-gray-100 rounded flex items-center justify-center text-sm">Media</div>
              )}
              <div className="mt-2 text-xs text-gray-600">{it.name}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => copyUrl(it.url)} className="px-2 py-1 border rounded text-xs">Copy URL</button>
                <button onClick={() => confirmDelete(it.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={confirm.open} title="Delete file" message="Delete this file from storage?" onConfirm={doDelete} onCancel={cancelDelete} />
    </div>
  );
}
