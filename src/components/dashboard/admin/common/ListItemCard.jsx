// src/components/dashboard/admin/common/ListItemCard.jsx
import React from "react";

/**
 * Reusable list item card for Course / Workshop Manager
 *
 * Props:
 * - item: { _id, title, image, meta }
 * - onEdit: fn
 * - onDelete: fn
 * - deleting: boolean
 */
export default function ListItemCard({ item, onEdit, onDelete, deleting }) {
  return (
    <li className="py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={item.image || "/images/placeholder.jpg"}
          alt={item.title}
          className="w-16 h-10 object-cover rounded border"
        />
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-gray-500">{item.meta}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="px-3 py-1 text-sm border rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded disabled:opacity-60"
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
