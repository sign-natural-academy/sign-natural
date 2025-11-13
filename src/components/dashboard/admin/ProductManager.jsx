// src/components/dashboard/admin/ProductManager.jsx
import React, { useEffect, useState } from "react";
import { getProducts } from "../../../api/services/products";
import ProductForm from "./ProductForm";

// optional toast
let toast;
try { toast = require("react-hot-toast").toast; } catch { toast = null; }

export default function ProductManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false); // Show form when creating

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast ? toast.error(err?.response?.data?.message || "Failed to load products") : alert("Failed to load products");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
              onClick={() => setPanelOpen(true)}
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
                {/* (v1 no edit/delete) */}
                <span className="text-xs text-gray-400">ID: {p._id.slice(-6)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT: form panel */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {panelOpen ? "Create Product" : "Create / Edit"}
          </h3>
          {panelOpen && (
            <button onClick={() => setPanelOpen(false)} className="text-sm underline">
              Close
            </button>
          )}
        </div>

        {panelOpen ? (
          <ProductForm
            onSuccess={async () => {
              setPanelOpen(false);
              await load();
            }}
            onCancel={() => setPanelOpen(false)}
          />
        ) : (
          <div className="text-gray-500 text-sm">
            Click <span className="font-medium">“New Product”</span> to add one.
          </div>
        )}
      </div>
    </div>
  );
}
