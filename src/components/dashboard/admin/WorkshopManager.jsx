// src/components/dashboard/admin/WorkshopManager.jsx
import React, { useEffect, useState } from "react";
import { getWorkshops, deleteWorkshop } from "../../../api/services/workshops";
import WorkshopForm from "./WorkshopForm";
import ListItemCard from "./common/ListItemCard";

let toast;
try {
  toast = require("react-hot-toast").toast;
} catch (_) {
  toast = { success: console.log, error: console.error, loading: console.log, dismiss: () => {} };
}

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      const res = await getWorkshops();
      setWorkshops(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading workshops:", err);
      toast.error(err?.response?.data?.message || "Failed to load workshops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workshop?")) return;
    setDeletingId(id);
    const tId = toast.loading("Deleting workshop…");
    try {
      await deleteWorkshop(id);
      toast.success("Workshop deleted", { id: tId });
      await loadWorkshops();
      if (selected && selected._id === id) setSelected(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed", { id: tId });
    } finally {
      setDeletingId(null);
    }
  };

  const isCreating = selected && !selected._id;
  const isEditing = selected && !!selected._id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg"></h3>
          <div className="flex items-center gap-2">
            <button
              onClick={loadWorkshops}
              disabled={loading}
              className="px-3 py-1 border rounded disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              onClick={() => setSelected({})}
              className="px-3 py-1 bg-green-700 text-white rounded"
            >
              + New Workshop
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-10 bg-gray-100 animate-pulse rounded" />
            <div className="h-10 bg-gray-100 animate-pulse rounded" />
            <div className="h-10 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-gray-500 py-6 text-center">No workshops found.</div>
        ) : (
          <ul className="divide-y">
            {workshops.map((w) => (
              <ListItemCard
                key={w._id}
                item={{
                  ...w,
                  meta: `${w.type || "—"} • ${w.duration || "—"} • ${w.location || "—"} • ${
                    w.price > 0 ? `₵${w.price}` : "Free"
                  }`,
                }}
                onEdit={setSelected}
                onDelete={handleDelete}
                deleting={deletingId === w._id}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {isEditing ? "Edit Workshop" : isCreating ? "Create Workshop" : "Create / Edit"}
          </h3>
          {selected && (
            <button onClick={() => setSelected(null)} className="text-sm underline">
              Close
            </button>
          )}
        </div>

        {selected ? (
          <WorkshopForm
            selected={selected}
            onSuccess={async () => {
              setSelected(null);
              await loadWorkshops();
            }}
            onCancel={() => setSelected(null)}
          />
        ) : (
          <div className="text-gray-500 text-sm">
            Select a workshop to edit or click <span className="font-medium">“New Workshop”</span> to create one.
          </div>
        )}
      </div>
    </div>
  );
}
