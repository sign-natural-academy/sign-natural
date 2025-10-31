// src/components/dashboard/admin/UsersManager.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getUserRole, getUser } from "../../../lib/auth";
import {
  listUsers,          // GET  /api/auth/users?search=&role=&page=&limit=
  updateUserRole,     // PATCH /api/auth/users/:id/role       body: { role: 'user'|'admin' }
  updateUserStatus,   // PATCH /api/auth/users/:id/status     body: { isActive: boolean }
  softDeleteUser,     // DELETE /api/auth/users/:id           (soft delete)
} from "../../../api/services/users";

let toast;
try { toast = require("react-hot-toast").toast; } catch { toast = null; }

const ROLE_FILTERS = [
  { value: "",          label: "All roles" },
  { value: "user",      label: "Users" },
  { value: "admin",     label: "Admins" },
  { value: "superuser", label: "Superusers" },
];

export default function UsersManager() {
  const me = getUser();
  const meId = me?._id || null;
  const meRole = getUserRole(); // 'user' | 'admin' | 'superuser' | null

  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage]       = useState(1);
  const [limit]               = useState(50);
  const [total, setTotal]     = useState(0);
  const [workingId, setWorkingId] = useState(null);

  const isSuper = meRole === "superuser";
  const isAdmin = meRole === "admin";

  const query = useMemo(
    () => ({ search, role: roleFilter, page, limit }),
    [search, roleFilter, page, limit]
  );

  const load = async () => {
    setLoading(true);
    try {
      // listUsers must call: GET /api/auth/users with { params: query }
      const res  = await listUsers(query);
      const data = res?.data;
      // Support either { items, total } or raw array
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const totalCount = Number(data?.total ?? items.length);
      setRows(items);
      setTotal(totalCount);
    } catch (e) {
      console.error(e);
      setRows([]);
      const msg = e?.response?.data?.message || "Failed to load users";
      if (toast) toast.error(msg); else alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.search, query.role, query.page, query.limit]);

  // --- RBAC: align with backend guards in authRoutes.js ---
  // - PATCH /users/:id/role -> requireSuperuser
  // - PATCH /users/:id/status, DELETE /users/:id -> requireAdminOrSuper
  //   Admins can only act on regular users; Superuser on user|admin (not superuser)
  const permsFor = (row) => {
    const isSelf = meId && String(row._id) === String(meId);

    // Default: no permissions
    let canChangeRole   = false; // only superuser & not for superuser rows & not self
    let canToggleStatus = false; // admin→users; super→users/admin; not for superuser rows; not self
    let canDelete       = false; // same as status

    if (isSelf) return { canChangeRole, canToggleStatus, canDelete };

    if (isSuper) {
      // Superuser cannot touch another superuser
      if (row.role !== "superuser") {
        canChangeRole   = true;
        canToggleStatus = true;
        canDelete       = true;
      }
    } else if (isAdmin) {
      // Admin cannot change roles at all
      // Admin can only act on regular users
      if (row.role === "user") {
        canToggleStatus = true;
        canDelete       = true;
      }
    }

    return { canChangeRole, canToggleStatus, canDelete };
  };

  // Actions — ensure bodies match backend validators exactly
  const doRoleChange = async (id, nextRole) => {
    setWorkingId(id);
    const t = toast ? toast.loading("Updating role…") : null;
    try {
      // Backend expects: { role: 'admin' | 'user' }
      await updateUserRole(id, "string" === typeof nextRole ? nextRole : nextRole?.role);
      if (toast) toast.success("Role updated", { id: t });
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update role";
      if (toast) toast.error(msg, { id: t }); else alert(msg);
    } finally {
      setWorkingId(null);
    }
  };

  const doStatus = async (id, nextActive) => {
    setWorkingId(id);
    const t = toast ? toast.loading(nextActive ? "Enabling user…" : "Disabling user…") : null;
    try {
      // Backend expects: { isActive: boolean }
      await updateUserStatus(id, Boolean(nextActive));
      if (toast) toast.success("Status updated", { id: t });
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update status";
      if (toast) toast.error(msg, { id: t }); else alert(msg);
    } finally {
      setWorkingId(null);
    }
  };

  const doDelete = async (id) => {
    if (!confirm("Soft delete this user? They will be marked inactive.")) return;
    setWorkingId(id);
    const t = toast ? toast.loading("Deleting…") : null;
    try {
      await softDeleteUser(id);
      if (toast) toast.success("User soft-deleted", { id: t });
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to delete user";
      if (toast) toast.error(msg, { id: t }); else alert(msg);
    } finally {
      setWorkingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Users</h3>
          <div className="text-xs text-gray-500">Manage roles & status (RBAC enforced)</div>
        </div>
        <button onClick={load} disabled={loading} className="px-3 py-1 border rounded disabled:opacity-50">
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search name or email…"
          className="w-full sm:max-w-xs border px-3 py-2 rounded"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}
          className="w-full sm:w-44 border px-3 py-2 rounded"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-6">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-500">No users found.</td></tr>
            ) : (
              rows.map((row) => {
                const created = row.createdAt ? new Date(row.createdAt).toLocaleString() : "—";
                const { canChangeRole, canToggleStatus, canDelete } = permsFor(row);
                const isWorking = workingId === row._id;

                return (
                  <tr key={row._id} className="border-b">
                    <td className="py-3 pr-3">{row.name}</td>
                    <td className="py-3 pr-3">{row.email}</td>
                    <td className="py-3 pr-3 capitalize">{row.role}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${row.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {row.isActive ? "active" : "disabled"}
                      </span>
                    </td>
                    <td className="py-3 pr-3">{created}</td>
                    <td className="py-3 pr-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Role controls — superuser only; never for superuser rows */}
                        {canChangeRole && row.role !== "admin" && (
                          <button
                            disabled={isWorking}
                            onClick={() => doRoleChange(row._id, "admin")}
                            className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
                          >
                            Promote to admin
                          </button>
                        )}
                        {canChangeRole && row.role === "admin" && (
                          <button
                            disabled={isWorking}
                            onClick={() => doRoleChange(row._id, "user")}
                            className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
                          >
                            Demote to user
                          </button>
                        )}

                        {/* Status controls */}
                        {canToggleStatus && row.isActive && (
                          <button
                            disabled={isWorking}
                            onClick={() => doStatus(row._id, false)}
                            className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
                          >
                            Disable
                          </button>
                        )}
                        {canToggleStatus && !row.isActive && (
                          <button
                            disabled={isWorking}
                            onClick={() => doStatus(row._id, true)}
                            className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
                          >
                            Enable
                          </button>
                        )}

                        {/* Soft delete */}
                        {canDelete && (
                          <button
                            disabled={isWorking}
                            onClick={() => doDelete(row._id)}
                            className="px-2 py-1 rounded border text-xs text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Simple pagination */}
      {Math.ceil(total / limit) > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span className="text-sm">Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= Math.max(1, Math.ceil(total / limit))}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
