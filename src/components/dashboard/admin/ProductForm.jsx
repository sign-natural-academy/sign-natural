// src/components/dashboard/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { createProduct } from "../../../api/services/products";
import { getWorkshops } from "../../../api/services/workshops";
import MediaPicker from "../../Media/MediaPicker"; // 

let toast;
try { toast = require("react-hot-toast").toast; } catch { toast = null; }

export default function ProductForm({ onSuccess, selected, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    relatedWorkshop: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);

  //  NEW
  const [libAsset, setLibAsset] = useState(null);      // { secure_url, public_id }
  const [pickerOpen, setPickerOpen] = useState(false); // modal flag

  useEffect(() => {
    (async () => {
      try {
        const res = await getWorkshops({ limit: 100 });
        setWorkshops(Array.isArray(res.data) ? res.data : []);
      } catch {
        setWorkshops([]);
      }
    })();
  }, []);

  const reset = () => {
    setForm({ name: "", description: "", price: "", relatedWorkshop: "", image: null });
    setPreview(null);
    setLibAsset(null); // 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
    if (file) setLibAsset(null); //  file overrides library pick
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const t = toast?.loading?.("Saving product…");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.description) fd.append("description", form.description);
      if (form.price !== "") fd.append("price", form.price);
      if (form.relatedWorkshop) fd.append("relatedWorkshop", form.relatedWorkshop);

      // Prefer file; otherwise use library selection
      if (form.image) {
        fd.append("image", form.image);
      } else if (libAsset?.secure_url) {
        fd.append("image", libAsset.secure_url);
        if (libAsset.public_id) fd.append("imagePublicId", libAsset.public_id);
      }

      await createProduct(fd);

      toast ? toast.success("Product created", { id: t }) : alert("Product created");
      reset();
      onSuccess?.();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save product.";
      toast ? toast.error(msg, { id: t }) : alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {selected ? "Edit Product" : "Add New Product"}
        </h3>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="e.g. Shea Butter Balm"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Short product description…"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Price + Related Workshop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Price (₵)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="e.g. 120"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Related Workshop (optional)</label>
            <select
              name="relatedWorkshop"
              value={form.relatedWorkshop}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            >
              <option value="">— None —</option>
              {workshops.map((w) => (
                <option key={w._id} value={w._id}>{w.title}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Link a product to a workshop for cross-promotion.</p>
          </div>
        </div>

        {/* Image (kept your file input; added Library button) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Product Image</label>
          <div className="flex flex-wrap gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="file:mr-4 file:rounded file:text-white file:border-0 file:bg-green-700 file:px-4 file:py-2"
            />
            {/* New button */}
            <button type="button" onClick={() => setPickerOpen(true)} className="px-4 py-2 border rounded">
              Choose from Library
            </button>
            {(preview || libAsset?.secure_url) && (
              <button
                type="button"
                className="px-3 py-2 border rounded"
                onClick={() => { setPreview(null); setLibAsset(null); setForm((p) => ({ ...p, image: null })); }}
              >
                Clear
              </button>
            )}
          </div>

          {(preview || libAsset?.secure_url) && (
            <div className="mt-3">
              <img src={preview || libAsset.secure_url} alt="Preview" className="w-full h-40 object-cover rounded border" />
              {libAsset?.public_id && (
                <div className="mt-1 text-xs text-gray-500 break-all">
                  public_id: {libAsset.public_id}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save Product"}
          </button>

          {onCancel && (
            <button type="button" className="text-sm text-gray-600 hover:underline" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Media Picker modal */}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialFolder="signnatural/products"
        onSelect={(asset) => {
          setLibAsset(asset);
          setPreview(null);                    // show library preview
          setForm((p) => ({ ...p, image: null })); // ensure we don't send a file too
        }}
      />
    </>
  );
}
