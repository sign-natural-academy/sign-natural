// src/components/dashboard/admin/UsersManager.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  listUsers,
  updateUserRole,
  updateUserStatus,
  softDeleteUser,
} from "../../../api/services/users";
import { motion } from "framer-motion";

// Optional toast (keeps working even if not installed)
let toast;
try { toast = require("react-hot-toast").toast; } catch { toast = null; }

// 🔔 Live updates via SSE (admin scope listens for admin_board:user_updated)
import useNotifications from "../../../hooks/useNotifications";

// Small utility
const ROLES = ["all", "user", "admin"];
const PAGE_SIZE = 50;

function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function UsersManager() {
  // Filters & paging
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search, 350);

  // Data
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  // SSE: when a user is updated elsewhere, reload the list
  const { items: sseItems } = useNotifications({ scope: "admin" });
  const lastReloadAtRef = useRef(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (role !== "all") params.role = role;

      const res = await listUsers(params);
      // Backend contract (from our Day 6 plan):
      // { items: [...], total: N, page, limit }
      const data = res.data || {};
      const items = Array.isArray(data.items) ? data.items : Array.isArray(res.data) ? res.data : [];

      setRows(items);
      setTotal(Number(data.total ?? items.length));
    } catch (e) {
      console.error(e);
      setRows([]);
      setTotal(0);
      setMsg(e?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Initial + whenever filters change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, role, page]);

  // Listen for admin_board:user_updated events → soft throttle reloads
  useEffect(() => {
    if (!sseItems || sseItems.length === 0) return;
    const latest = sseItems[0];
    if (latest?.kind === "admin_board" && latest?.type === "user_updated") {
      const now = Date.now();
      if (now - lastReloadAtRef.current > 1200) {
        lastReloadAtRef.current = now;
        load();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sseItems]);

  const onPromoteDemote = async (user) => {
    const nextRole = user.role === "admin" ? "user" : "admin";
    setBusyId(user._id);
    const t = toast ? toast.loading(`Updating role…`) : null;
    try {
      await updateUserRole(user._id, nextRole);
      toast ? toast.success("Role updated", { id: t }) : setMsg("Role updated.");
      await load();
    } catch (e) {
      const m = e?.response?.data?.message || "Failed to update role.";
      toast ? toast.error(m, { id: t }) : setMsg(m);
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  const onToggleActive = async (user) => {
    const current = typeof user.isActive === "boolean" ? user.isActive : true;
    const next = !current;
    setBusyId(user._id);
    const t = toast ? toast.loading(`${next ? "Enabling" : "Disabling"} user…`) : null;
    try {
      await updateUserStatus(user._id, next);
      toast ? toast.success("Status updated", { id: t }) : setMsg("Status updated.");
      await load();
    } catch (e) {
      const m = e?.response?.data?.message || "Failed to update status.";
      toast ? toast.error(m, { id: t }) : setMsg(m);
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  const onSoftDelete = async (user) => {
    if (!confirm(`Soft delete this user (${user.email})? They will be disabled.`)) return;
    setBusyId(user._id);
    const t = toast ? toast.loading("Deleting…") : null;
    try {
      await softDeleteUser(user._id);
      toast ? toast.success("User disabled", { id: t }) : setMsg("User disabled.");
      await load();
    } catch (e) {
      const m = e?.response?.data?.message || "Failed to delete user.";
      toast ? toast.error(m, { id: t }) : setMsg(m);
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRole("all");
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="bg-white shadow rounded-lg p-4"
    >
      {/* Header / Filters */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Users</h3>
          <div className="text-xs text-gray-500">
            Manage roles, status & search users
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 border border-gray-300 rounded px-3 py-2"
          />
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                Role: {r}
              </option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="px-3 py-2 border rounded text-sm disabled:opacity-50"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {msg && <div className="mb-3 text-sm text-amber-700">{msg}</div>}

      {/* Table */}
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
              <tr>
                <td colSpan={6} className="py-6">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const isActive =
                  typeof u.isActive === "boolean" ? u.isActive : true;
                const created =
                  u.createdAt ? new Date(u.createdAt).toLocaleString() : "—";
                const isBusy = busyId === u._id;

                return (
                  <tr key={u._id} className="border-b">
                    <td className="py-3 pr-3">{u.name || "—"}</td>
                    <td className="py-3 pr-3">{u.email || "—"}</td>
                    <td className="py-3 pr-3 capitalize">{u.role || "user"}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-3 pr-3">{created}</td>
                    <td className="py-3 pr-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={isBusy}
                          onClick={() => onPromoteDemote(u)}
                          className="px-2 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-50"
                          title={
                            u.role === "admin" ? "Demote to user" : "Promote to admin"
                          }
                        >
                          {u.role === "admin" ? "Demote" : "Promote"}
                        </button>

                        <button
                          disabled={isBusy}
                          onClick={() => onToggleActive(u)}
                          className="px-2 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-50"
                          title={isActive ? "Disable user" : "Enable user"}
                        >
                          {isActive ? "Disable" : "Enable"}
                        </button>

                        <button
                          disabled={isBusy}
                          onClick={() => onSoftDelete(u)}
                          className="px-2 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-50"
                          title="Soft delete (set inactive)"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}
