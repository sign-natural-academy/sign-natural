// src/components/dashboard/admin/WorkshopForm.jsx
import React, { useEffect, useState, useRef } from "react";
import { createWorkshop, updateWorkshop } from "../../../api/services/workshops";
import MediaPicker from "../../Media/MediaPicker"; // ✅ added

const TYPE_OPTIONS = [
  { value: "celebration", label: "Celebration" },
  { value: "diasporan", label: "Diasporan" },
  { value: "group", label: "Group" },
  { value: "other", label: "Other" },
];

export default function WorkshopForm({ selected, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    participants: "",
    type: "group",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ NEW: media library selection state
  const [libAsset, setLibAsset] = useState(null);        // { secure_url, public_id }
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (selected && selected._id) {
      setForm({
        title: selected.title || "",
        description: selected.description || "",
        price: selected.price ?? "",
        duration: selected.duration || "",
        location: selected.location || "",
        participants: selected.participants || "",
        type: selected.type || "group",
        image: null,
      });
      setPreview(selected.image || null);
      setLibAsset(null); // ✅ reset library selection when editing an item
    } else {
      resetForm();
    }
  }, [selected]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      duration: "",
      location: "",
      participants: "",
      type: "group",
      image: null,
    });
    setPreview(null);
    setLibAsset(null); // ✅
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, image: file || null }));
    if (file) {
      setPreview(URL.createObjectURL(file));
      setLibAsset(null); // ✅ choosing a file overrides library pick
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("duration", form.duration);
    fd.append("location", form.location);
    fd.append("participants", form.participants);
    fd.append("type", form.type);

    // ✅ Prefer file if provided; otherwise send library URL + public_id
    if (form.image) {
      fd.append("image", form.image);
    } else if (libAsset?.secure_url) {
      fd.append("image", libAsset.secure_url);
      if (libAsset.public_id) fd.append("imagePublicId", libAsset.public_id);
    }

    try {
      if (selected?._id) {
        await updateWorkshop(selected._id, fd);
        alert("✅ Workshop updated successfully!");
      } else {
        await createWorkshop(fd);
        alert("✅ New workshop added successfully!");
      }
      resetForm();
      onSuccess?.();
    } catch (err) {
      console.error("Error saving workshop:", err);
      alert(err?.response?.data?.message || "❌ Failed to save workshop.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isEditing = !!selected?._id;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4 transition"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Edit Workshop" : "Add New Workshop"}
        </h3>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Workshop Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            placeholder="Enter workshop title"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter workshop description"
            rows="4"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Price, Duration, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price (₵)
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="0 if free"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Duration
            </label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              type="text"
              placeholder="e.g. 2 hours"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Accra / Online"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Participants
          </label>
          <input
            name="participants"
            value={form.participants}
            onChange={handleChange}
            type="text"
            placeholder="e.g. 10 - 20 / Unlimited"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Choose the workshop category.
          </p>
        </div>

        {/* Image Upload + Library (kept your UI; only added a new button) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Workshop Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={triggerFileInput}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
            >
              Upload Image
            </button>

            {/* ✅ New: open media library */}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-4 py-2 border rounded"
            >
              Choose from Library
            </button>

            {(preview || libAsset?.secure_url) && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setLibAsset(null);
                  setForm((p) => ({ ...p, image: null }));
                }}
                className="px-3 py-2 border rounded"
              >
                Clear
              </button>
            )}

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-24 object-cover rounded border"
              />
            )}
            {!preview && libAsset?.secure_url && (
              <img
                src={libAsset.secure_url}
                alt="Preview"
                className="w-32 h-24 object-cover rounded border"
              />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Show public_id for library pick */}
          {!preview && libAsset?.public_id && (
            <div className="text-xs text-gray-500 break-all mt-1">
              public_id: {libAsset.public_id}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
              ? "Update Workshop"
              : "Add Workshop"}
          </button>

          {(isEditing || onCancel) && (
            <button
              type="button"
              onClick={onCancel || resetForm}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ✅ Media Picker modal */}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialFolder="signnatural/workshops"
        onSelect={(asset) => {
          setLibAsset(asset);
          setPreview(null);                // use the library preview
          setForm((p) => ({ ...p, image: null })); // make sure no file is sent together
        }}
      />
    </>
  );
}
