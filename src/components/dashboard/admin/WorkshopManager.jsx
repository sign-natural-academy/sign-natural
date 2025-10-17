// src/components/dashboard/admin/WorkShopManager.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import WorkshopForm from "./WorkshopForm";
import ConfirmModal from "../../dashboardUi/ConfirmModal";

/**
 * WorkshopManager - list, create, edit, delete workshops
 */
export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/workshops", { headers: authHeaders() });
      setWorkshops(Array.isArray(res.data) ? res.data : res.data?.workshops ?? []);
    } catch (err) {
      console.error(err);
      setWorkshops([
        { id: "w-1", title: "Glow-Up Celebration", description: "Celebrate with a guided skincare pampering session.", location: "Accra", dateTime: new Date().toISOString(), capacity: 12, price: "₵150", image: "/images/party4.jpg" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (w) => { setEditing(w); setShowForm(true); };
  const confirmDelete = (id) => setConfirm({ open: true, id });
  const cancelDelete = () => setConfirm({ open: false, id: null });

  const doDelete = async () => {
    const id = confirm.id;
    if (!id) return;
    try {
      await api.delete(`/api/workshops/${id}`, { headers: authHeaders() });
      setWorkshops((s) => s.filter((x) => x.id !== id));
      setMsg("Workshop deleted.");
    } catch (err) {
      console.error(err);
      setMsg("Failed to delete.");
    } finally {
      cancelDelete();
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Workshops Management</h2>
        <div>
          <button onClick={openCreate} className="px-3 py-1 bg-[#7d4c35] text-white rounded">Add Workshop</button>
        </div>
      </div>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <WorkshopForm workshop={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading workshops…</div>
      ) : workshops.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No workshops yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workshops.map((w) => (
            <div key={w.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <img src={w.image || "/images/group1.jpg"} alt={w.title} className="w-full h-36 object-cover rounded mb-3" />
              <div className="flex-1">
                <h3 className="font-semibold">{w.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{w.description}</p>
                <div className="mt-2 text-sm text-gray-700">📍 {w.location} • {w.dateTime ? new Date(w.dateTime).toLocaleString() : "-"}</div>
                <div className="mt-1 text-sm text-gray-700">Capacity: {w.capacity ?? "-"}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(w)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                <button onClick={() => confirmDelete(w.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={confirm.open} title="Delete workshop" message="Are you sure you want to delete this workshop?" onConfirm={doDelete} onCancel={cancelDelete} />
    </div>
  );
}
