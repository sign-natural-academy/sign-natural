// src/components/dashboardUi/UsersManager.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import ConfirmModal from "../../dashboardUi/ConfirmModal";

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, action: null });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users", { headers: authHeaders() });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users ?? []);
    } catch (err) {
      console.error("fetch users:", err);
      setUsers([
        { id: "u-1", name: "Ama", email: "ama@example.com", role: "learner", active: true, lastActive: "2024-12-01" },
        { id: "u-2", name: "Kofi", email: "kofi@example.com", role: "instructor", active: true, lastActive: "2025-01-02" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => (q ? `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()) : true));

  const openConfirm = (id, action) => setConfirm({ open: true, id, action });
  const closeConfirm = () => setConfirm({ open: false, id: null, action: null });

  const performConfirm = async () => {
    const { id, action } = confirm;
    if (!id || !action) return;
    try {
      if (action === "deactivate" || action === "activate") {
        const newStatus = action === "activate";
        await api.patch(`/api/users/${id}/status`, { active: newStatus }, { headers: authHeaders() });
        setUsers((s) => s.map((u) => (u.id === id ? { ...u, active: newStatus } : u)));
        setMsg(`User ${newStatus ? "activated" : "deactivated"}.`);
      } else if (action === "delete") {
        await api.delete(`/api/users/${id}`, { headers: authHeaders() });
        setUsers((s) => s.filter((x) => x.id !== id));
        setMsg("User deleted.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Action failed.");
    } finally {
      closeConfirm();
    }
  };

  const changeRole = async (id, role) => {
    setMsg("");
    try {
      await api.patch(`/api/users/${id}/role`, { role }, { headers: authHeaders() });
      setUsers((s) => s.map((u) => (u.id === id ? { ...u, role } : u)));
      setMsg("Role updated.");
    } catch (err) {
      console.error(err);
      setMsg("Failed to update role.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users & Roles</h2>
        <div className="flex gap-2 items-center">
          <input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} className="border px-3 py-1 rounded w-64" />
          <button onClick={load} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
        </div>
      </div>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {loading ? (
        <div className="py-8 text-center">Loading users…</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="border px-2 py-1 rounded">
                      <option value="learner">learner</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.lastActive ?? "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button onClick={() => openConfirm(u.id, u.active ? "deactivate" : "activate")} className="px-2 py-1 bg-gray-200 rounded text-xs">
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => openConfirm(u.id, "delete")} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={confirm.open} title={confirm.action === "delete" ? "Delete user" : confirm.action === "deactivate" ? "Deactivate user" : "Activate user"} message="Are you sure?" onConfirm={performConfirm} onCancel={closeConfirm} />
    </div>
  );
}
