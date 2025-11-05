// src/components/dashboard/admin/SettingsPanel.jsx
import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../../api/services/settings';

export default function SettingsPanel() {
  const [loading, setLoading] = useState(true);               // 1
  const [error, setError] = useState('');                     // 2
  const [msg, setMsg] = useState('');                         // 3

  const [form, setForm] = useState({                          // 4
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    privacyPolicyUrl: '',
    refundPolicyUrl: '',
    termsUrl: '',
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  });
  const [logoPreview, setLogoPreview] = useState('');         // 5
  const [logoFile, setLogoFile] = useState(null);             // 6

  useEffect(() => {                                           // 7
    (async () => {
      setLoading(true); setError(''); setMsg('');
      try {
        const s = await getSettings();
        setForm({
          siteName: s.siteName || '',
          contactEmail: s.contactEmail || '',
          contactPhone: s.contactPhone || '',
          address: s.address || '',
          privacyPolicyUrl: s.privacyPolicyUrl || '',
          refundPolicyUrl: s.refundPolicyUrl || '',
          termsUrl: s.termsUrl || '',
          facebook: s.socials?.facebook || '',
          instagram: s.socials?.instagram || '',
          youtube: s.socials?.youtube || '',
          tiktok: s.socials?.tiktok || '',
        });
        setLogoPreview(s.logoUrl || '');
      } catch (e) {
        console.error(e); setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {                                   // 8
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onLogo = (e) => {                                     // 9
    const file = e.target.files?.[0];
    setLogoFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      setLogoPreview('');
    }
  };

  const onSubmit = async (e) => {                             // 10
    e.preventDefault();
    setMsg(''); setError('');
    try {
      const payload = {
        ...form,
        logo: logoFile || undefined,                          // 11
        // socials flattened: backend expects fields in body (we map them there)
        facebook: form.facebook,
        instagram: form.instagram,
        youtube: form.youtube,
        tiktok: form.tiktok,
      };
      const s = await updateSettings(payload);                // 12
      setMsg('Settings saved');
      if (s.logoUrl) setLogoPreview(s.logoUrl);
    } catch (e) {
      console.error(e); setError('Save failed');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>

      {loading && <div className="text-gray-600 text-sm">Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {msg && <div className="text-green-700 text-sm">{msg}</div>}

      {!loading && (
        <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4">
          {/* Basic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs block mb-1">Site Name</label>
              <input name="siteName" value={form.siteName} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">Contact Email</label>
              <input name="contactEmail" value={form.contactEmail} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">Contact Phone</label>
              <input name="contactPhone" value={form.contactPhone} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs block mb-1">Address</label>
              <input name="address" value={form.address} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
          </div>

          {/* Policies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs block mb-1">Privacy Policy URL</label>
              <input name="privacyPolicyUrl" value={form.privacyPolicyUrl} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">Refund Policy URL</label>
              <input name="refundPolicyUrl" value={form.refundPolicyUrl} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">Terms & Conditions URL</label>
              <input name="termsUrl" value={form.termsUrl} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
          </div>

          {/* Socials */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs block mb-1">Facebook</label>
              <input name="facebook" value={form.facebook} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">Instagram</label>
              <input name="instagram" value={form.instagram} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">YouTube</label>
              <input name="youtube" value={form.youtube} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs block mb-1">TikTok</label>
              <input name="tiktok" value={form.tiktok} onChange={onChange} className="border px-3 py-2 rounded w-full" />
            </div>
          </div>

          {/* Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs block mb-1">Logo</label>
              <input type="file" accept="image/*" onChange={onLogo} className="block" />
              {logoPreview && (
                <img src={logoPreview} alt="logo preview" className="mt-2 h-16 object-contain" />
              )}
            </div>
          </div>

          <div>
            <button className="px-4 py-2 bg-[#7d4c35] text-white rounded">Save Settings</button>
          </div>
        </form>
      )}
    </div>
  );
}
