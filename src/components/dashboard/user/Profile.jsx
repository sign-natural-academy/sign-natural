// src/components/user/Profile.jsx
import React, { useEffect, useState } from "react";
import { getMe, updateMyProfile, updateMyAvatar } from "../../../api/services/auth";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Load current user
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const u = await getMe(); // service returns data (user)
        if (!mounted) return;
        setMe(u);
        setForm({ name: u.name || "", email: u.email || "" });
        setAvatarPreview(u.avatar || "");
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load your profile. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Handlers
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    // Optimistic UI snapshot
    const prev = { ...me };

    try {
      setMe((m) => ({ ...(m || {}), name: form.name, email: form.email }));
      const updated = await updateMyProfile({ name: form.name, email: form.email });
      // sync final result
      setMe(updated);
      setMsg("Profile updated.");
    } catch (err) {
      // rollback optimistic UI
      setMe(prev);
      setError(err?.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file || null);
    setAvatarPreview(file ? URL.createObjectURL(file) : avatarPreview);
    setMsg("");
    setError("");
  };

  const onSaveAvatar = async () => {
    if (!avatarFile) return;
    setAvatarSaving(true);
    setMsg("");
    setError("");

    // Optimistic preview is already shown via URL.createObjectURL
    try {
      const updated = await updateMyAvatar(avatarFile);
      setMe(updated);
      setAvatarPreview(updated.avatar || avatarPreview);
      setAvatarFile(null);
      setMsg("Avatar updated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Avatar upload failed.");
    } finally {
      setAvatarSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold"></h3>

      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : (
        <>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {msg && <div className="text-sm text-green-700">{msg}</div>}

          {/* Basic info */}
          <form onSubmit={onSave} className="bg-white p-4 rounded shadow space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs block mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="border px-3 py-2 rounded w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </form>

          {/* Avatar */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <div className="text-sm font-semibold">Avatar</div>
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview || "/avatar-placeholder.png"}
                alt="avatar"
                className="h-16 w-16 rounded-full object-cover border"
              />
              <div className="space-y-2">
                <input type="file" accept="image/*" onChange={onPickAvatar} />
                <div className="flex gap-2">
                  <button
                    onClick={onSaveAvatar}
                    disabled={!avatarFile || avatarSaving}
                    className="px-4 py-2 bg-[#7d4c35] text-white rounded disabled:opacity-50"
                  >
                    {avatarSaving ? "Uploading…" : "Update Avatar"}
                  </button>
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={() => { setAvatarFile(null); setAvatarPreview(me?.avatar || ""); }}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {/* Use a clear square image (JPG/PNG). Uploads are optimized via Cloudinary. */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
