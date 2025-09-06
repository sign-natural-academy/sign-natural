// src/components/dashboardUi/ConfirmModal.jsx
import React from "react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", busy = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded border">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          >
            {busy ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
