// src/components/dashboard/admin/ApproveTestimonials.jsx
import React, { useEffect, useState, useCallback } from "react";
import ConfirmModal from "../../dashboardUi/ConfirmModal";
import {
  getPendingTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from "../../../api/services/testimonials";
import useNotificationSSE from "../../../hooks/useNotificationSSE";

// optional toast (works if react-hot-toast is installed)
let toast;
try { toast = require("react-hot-toast").toast; } catch { toast = null; }

export default function ApproveTestimonials() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set()); // store _id values
  const [confirm, setConfirm] = useState({ open: false, id: null, action: null });
  const [msg, setMsg] = useState("");
  const [workingId, setWorkingId] = useState(null); // disable per-card buttons while acting

  const load = useCallback(async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await getPendingTestimonials();
      // Backend returns an array of pending testimonials
      setStories(Array.isArray(res.data) ? res.data : res.data?.testimonials ?? []);
    } catch (err) {
      console.error(err);
      setStories([]);
      setMsg(err?.response?.data?.message || "Failed to load pending stories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 🔴 LIVE: refresh pending list whenever testimonial events occur
  useNotificationSSE({
    onEvent: (payload) => {
      const t = payload?.type;
      if (!t) return;
      if (
        t === "testimonial_pending_created" ||
        t === "testimonial_approved" ||
        t === "testimonial_deleted"
      ) {
        // Re-pull list; stays in sync with server state
        load();
      }
    },
  });

  const toggle = (id) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openConfirm = (id, action) => setConfirm({ open: true, id, action });
  const closeConfirm = () => setConfirm({ open: false, id: null, action: null });

  const doConfirm = async () => {
    const { id, action } = confirm;
    setWorkingId(id);
    const tId = toast ? toast.loading(action === "approve" ? "Approving…" : "Deleting…") : null;
    try {
      if (action === "approve") {
        await approveTestimonial(id);
      } else {
        await deleteTestimonial(id); // "reject" path
      }
      toast ? toast.success("Done", { id: tId }) : setMsg("Done");
      await load();
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    } catch (err) {
      const m = err?.response?.data?.message || "Action failed.";
      toast ? toast.error(m, { id: tId }) : setMsg(m);
      console.error(err);
    } finally {
      setWorkingId(null);
      closeConfirm();
    }
  };

  // Bulk helpers (loop client-side)
  const bulkAction = async (action) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const tId = toast ? toast.loading(action === "approve" ? "Approving selected…" : "Deleting selected…") : null;

    try {
      for (const id of ids) {
        if (action === "approve") await approveTestimonial(id);
        else await deleteTestimonial(id);
      }
      toast ? toast.success("Bulk action complete", { id: tId }) : setMsg("Bulk action complete.");
      await load();
      setSelected(new Set());
    } catch (err) {
      const m = err?.response?.data?.message || "Bulk action failed.";
      toast ? toast.error(m, { id: tId }) : setMsg(m);
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Testimonials / Stories (Pending)</h2>
        <div className="flex gap-2">
          <button onClick={() => bulkAction("approve")} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
            Approve selected
          </button>
          <button onClick={() => bulkAction("reject")} className="px-3 py-1 bg-red-600 text-white rounded text-sm">
            Reject selected
          </button>
          <button onClick={load} disabled={loading} className="px-3 py-1 border rounded text-sm disabled:opacity-50">
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {loading ? (
        <div className="py-8 text-center">Loading…</div>
      ) : stories.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No pending stories.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => {
            const id = s._id;
            const title = s.tag || "Story";
            const date = s.createdAt ? new Date(s.createdAt).toLocaleString() : "";
            return (
              <div key={id} className="bg-white rounded shadow p-3 flex flex-col">
                {s.imageUrl && (
                  <img src={s.imageUrl} alt={title} className="w-full h-40 object-cover rounded mb-3" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-xs text-gray-500">{date}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selected.has(id)}
                    onChange={() => toggle(id)}
                    aria-label="Select for bulk action"
                  />
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-line">{s.text}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openConfirm(id, "approve")}
                    disabled={workingId === id}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                  >
                    {workingId === id ? "Working…" : "Approve"}
                  </button>
                  <button
                    onClick={() => openConfirm(id, "reject")}
                    disabled={workingId === id}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title={confirm.action === "approve" ? "Approve story" : "Reject story"}
        message="Proceed?"
        onConfirm={doConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
