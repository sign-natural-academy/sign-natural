// src/components/dashboard/admin/ProductManager.jsx
import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../../api/services/products";
import ProductForm from "./ProductForm";

// optional toast
let toast;
try { toast = require("react-hot-toast").toast; } catch { toast = null; }

export default function ProductManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false); // Show form when creating/editing
  const [selected, setSelected] = useState(null);    // product being edited
  const [busyId, setBusyId] = useState(null);        // per-item busy indicator for delete

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : res?.items ?? []);
      setRows(items);
    } catch (err) {
      console.error(err);
      toast ? toast.error(err?.response?.data?.message || "Failed to load products") : alert("Failed to load products");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Open panel for creating (no selected)
  const openCreate = () => {
    setSelected(null);
    setPanelOpen(true);
  };

  // Open panel with selected product for edit (ProductForm must handle `selected` prop)
  const openEdit = (product) => {
    setSelected(product);
    setPanelOpen(true);
  };

  // Delete product (minimal change: calls service and updates local list)
  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this product? This action cannot be undone.")) return;

    setBusyId(id);
    try {
      await deleteProduct(id);
      setRows((prev) => prev.filter((p) => String(p._id) !== String(id)));
      toast ? toast.success("Product deleted") : alert("Product deleted");
    } catch (err) {
      console.error("Delete failed", err);
      const msg = err?.response?.data?.message || "Failed to delete product";
      toast ? toast.error(msg) : alert(msg);
    } finally {
      setBusyId(null);
    }
  };

  const onFormSuccess = async () => {
    setPanelOpen(false);
    setSelected(null);
    await load();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: list */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg"></h3>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="px-3 py-1 border rounded disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              onClick={openCreate}
              className="px-3 py-1 bg-green-700 text-white rounded"
            >
              + New Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-10 bg-gray-100 animate-pulse rounded" />
            <div className="h-10 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-gray-500 py-6 text-center">No products yet.</div>
        ) : (
          <ul className="divide-y">
            {rows.map((p) => (
              <li key={p._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || "/images/placeholder.jpg"}
                    alt={p.name}
                    className="w-16 h-10 object-cover rounded border"
                  />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {typeof p.price === "number" ? `₵${p.price}` : "—"} {p.relatedWorkshop ? "• linked" : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 mr-2">ID: {String(p._id).slice(-6)}</div>

                  {/* Edit button (minimal add) */}
                  <button
                    onClick={() => openEdit(p)}
                    className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  {/* Delete button (minimal add) */}
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={busyId === p._id}
                    className="text-sm px-2 py-1 bg-red-600 text-white rounded disabled:opacity-60"
                  >
                    {busyId === p._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT: form panel (unchanged pattern, now supports edit via `selected`) */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {panelOpen ? (selected ? "Edit Product" : "Create Product") : "Create / Edit"}
          </h3>
          {panelOpen && (
            <button onClick={() => { setPanelOpen(false); setSelected(null); }} className="text-sm underline">
              Close
            </button>
          )}
        </div>

        {panelOpen ? (
          <ProductForm
            selected={selected}
            onSuccess={onFormSuccess}
            onCancel={() => { setPanelOpen(false); setSelected(null); }}
          />
        ) : (
          <div className="text-gray-500 text-sm">
            Click <span className="font-medium">“New Product”</span> to add one, or press Edit on an existing product.
          </div>
        )}
      </div>
    </div>
  );
}
