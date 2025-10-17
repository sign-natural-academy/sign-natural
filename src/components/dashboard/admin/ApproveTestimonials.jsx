// src/components/dashboard/admin/ApproveTestimonials.jsx
ApproveTestimonials.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import ConfirmModal from "../../dashboardUi/ConfirmModal";

export default function ApproveTestimonials() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [confirm, setConfirm] = useState({ open: false, id: null, action: null });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/testimonials?status=pending", { headers: authHeaders() });
      setStories(res.data?.testimonials ?? res.data ?? []);
    } catch (err) {
      console.error(err);
      setStories([
        { id: "s1", name: "Amara", text: "Great class!", image: "/images/soap2.jpg", status: "pending" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const bulkAction = (action) => {
    // bulk approve or reject
    (async () => {
      const ids = Array.from(selected);
      if (ids.length === 0) return;
      try {
        await api.patch(`/api/testimonials/bulk`, { ids, action }, { headers: authHeaders() });
        setMsg("Bulk action completed.");
        load();
        setSelected(new Set());
      } catch (err) {
        console.error(err);
        setMsg("Bulk action failed.");
      }
    })();
  };

  const openConfirm = (id, action) => setConfirm({ open: true, id, action });
  const closeConfirm = () => setConfirm({ open: false, id: null, action: null });

  const doConfirm = async () => {
    const { id, action } = confirm;
    try {
      await api.patch(`/api/testimonials/${id}`, { status: action === "approve" ? "published" : "rejected" }, { headers: authHeaders() });
      setMsg("Updated.");
      load();
    } catch (err) {
      console.error(err);
      setMsg("Failed.");
    } finally {
      closeConfirm();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Testimonials / Stories (Pending)</h2>
        <div className="flex gap-2">
          <button onClick={() => bulkAction("approve")} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve selected</button>
          <button onClick={() => bulkAction("reject")} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Reject selected</button>
          <button onClick={load} className="px-3 py-1 border rounded text-sm">Refresh</button>
        </div>
      </div>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {loading ? (
        <div className="py-8 text-center">Loading…</div>
      ) : stories.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No pending stories.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div key={s.id} className="bg-white rounded shadow p-3 flex flex-col">
              {s.image && <img src={s.image} alt={s.name} className="w-full h-40 object-cover rounded mb-3" />}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.subtitle ?? ""}</div>
                </div>
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
              </div>
              <p className="text-sm text-gray-700">{s.text}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openConfirm(s.id, "approve")} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                <button onClick={() => openConfirm(s.id, "reject")} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={confirm.open} title={confirm.action === "approve" ? "Approve story" : "Reject story"} message="Proceed?" onConfirm={doConfirm} onCancel={closeConfirm} />
    </div>
  );
}
