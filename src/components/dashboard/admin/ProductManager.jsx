// src/components/dashboardUi/ProductManager.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";
import ConfirmModal from "../../dashboardUi/ConfirmModal";

function ProductForm({ product = null, workshops = [], onSaved = () => {}, onCancel = () => {} }) {
  const [form, setForm] = useState({ title: "", description: "", price: "", image: "", linkedWorkshopId: "" });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (product) setForm({ title: product.title, description: product.description, price: product.price, image: product.image, linkedWorkshopId: product.linkedWorkshopId || "" });
  }, [product]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("linkedWorkshopId", form.linkedWorkshopId);
      if (file) fd.append("image", file);

      if (product && product.id) {
        await api.put(`/api/products/${product.id}`, fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/api/products", fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border px-3 py-2 rounded w-full" required />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border px-3 py-2 rounded w-full" />
      <div className="flex gap-2">
        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="border px-3 py-2 rounded" />
        <select value={form.linkedWorkshopId} onChange={(e) => setForm({ ...form, linkedWorkshopId: e.target.value })} className="border px-3 py-2 rounded">
          <option value="">-- Link to workshop (optional)</option>
          {workshops.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}
        </select>
      </div>

      <div>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <div className="flex gap-2">
        <button disabled={busy} className="px-3 py-1 bg-[#7d4c35] text-white rounded">{busy ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
      </div>
    </form>
  );
}

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, wRes] = await Promise.all([api.get("/api/products", { headers: authHeaders() }), api.get("/api/workshops", { headers: authHeaders() })]);
      setProducts(pRes.data?.products ?? pRes.data ?? []);
      setWorkshops(wRes.data?.workshops ?? wRes.data ?? []);
    } catch (err) {
      console.error(err);
      setProducts([{ id: "p1", title: "Shea Body Butter", price: "GH 45.99", image: "/soap.jpg" }]);
      setWorkshops([{ id: "w-1", title: "Glow-Up Celebration" }]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setShowForm(true); };

  const confirmDelete = (id) => setConfirm({ open: true, id });
  const cancelDelete = () => setConfirm({ open: false, id: null });

  const doDelete = async () => {
    const id = confirm.id;
    if (!id) return;
    try {
      await api.delete(`/api/products/${id}`, { headers: authHeaders() });
      setProducts((s) => s.filter((x) => x.id !== id));
      setMsg("Deleted product.");
    } catch (err) {
      console.error(err);
      setMsg("Delete failed.");
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
        <h2 className="text-xl font-semibold">Products</h2>
        <button onClick={openCreate} className="px-3 py-1 bg-[#7d4c35] text-white rounded">Add Product</button>
      </div>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <ProductForm product={editing} workshops={workshops} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="py-6 text-center">Loading…</div>
      ) : products.length === 0 ? (
        <div className="py-6 text-center text-gray-500">No products</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded shadow p-3">
              <img src={p.image || "/soap.jpg"} alt={p.title} className="w-full h-36 object-cover rounded mb-2" />
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.price}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(p)} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                <button onClick={() => confirmDelete(p.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={confirm.open} title="Delete product" message="Are you sure?" onConfirm={doDelete} onCancel={cancelDelete} />
    </div>
  );
}
