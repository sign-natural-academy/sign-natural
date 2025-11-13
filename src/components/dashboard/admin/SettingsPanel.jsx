// src/components/dashboard/admin/SettingsPanel.jsx
import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../../api/services/settings';
import { getMe, updateMyProfile, changeMyPassword, updateMyAvatar } from '../../../api/services/auth';
import MediaPicker from '../../Media/MediaPicker'; // added

export default function SettingsPanel() {
  const [tab, setTab] = useState('site');                         // 'site' | 'profile'

  // --- Site settings (Day 10) ---
  const [loadingSite, setLoadingSite] = useState(true);
  const [siteError, setSiteError] = useState('');
  const [siteMsg, setSiteMsg] = useState('');
  const [siteForm, setSiteForm] = useState({
    siteName: '', contactEmail: '', contactPhone: '', address: '',
    privacyPolicyUrl: '', refundPolicyUrl: '', termsUrl: '',
    facebook: '', instagram: '', youtube: '', tiktok: '',
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  // NEW: library option for logo
  const [logoAsset, setLogoAsset] = useState(null);         // { secure_url, public_id }
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);

  // --- My profile (Day 11) ---
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [me, setMe] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    // load site
    (async () => {
      setLoadingSite(true); setSiteError(''); setSiteMsg('');
      try {
        const s = await getSettings();
        setSiteForm({
          siteName: s.siteName || '', contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '',
          address: s.address || '',
          privacyPolicyUrl: s.privacyPolicyUrl || '', refundPolicyUrl: s.refundPolicyUrl || '', termsUrl: s.termsUrl || '',
          facebook: s.socials?.facebook || '', instagram: s.socials?.instagram || '', youtube: s.socials?.youtube || '', tiktok: s.socials?.tiktok || '',
        });
        setLogoPreview(s.logoUrl || '');
      } catch (e) {
        setSiteError('Failed to load settings');
      } finally {
        setLoadingSite(false);
      }
    })();

    // load my profile
    (async () => {
      setLoadingProfile(true); setProfileError(''); setProfileMsg('');
      try {
        const u = await getMe();
        setMe(u);
        setProfileForm({ name: u.name || '', email: u.email || '' });
        setAvatarPreview(u.avatar || '');
      } catch (e) {
        setProfileError('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  // --- handlers: site ---
  const onSiteChange = (e) => setSiteForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onLogo = (e) => {
    const file = e.target.files?.[0]; setLogoFile(file || null);
    setLogoAsset(null); // file overrides library
    setLogoPreview(file ? URL.createObjectURL(file) : '');
  };
  const saveSite = async (e) => {
    e.preventDefault(); setSiteMsg(''); setSiteError('');
    try {
      // Keep your service contract: send FormData (file if present; else library values)
      const fd = new FormData();
      Object.entries(siteForm).forEach(([k, v]) => fd.append(k, v ?? ""));

      if (logoFile) {
        fd.append("logo", logoFile);
      } else if (logoAsset?.secure_url) {
        fd.append("logoUrl", logoAsset.secure_url);
        if (logoAsset.public_id) fd.append("logoPublicId", logoAsset.public_id);
      }

      const s = await updateSettings(fd); // your service handles multipart/FormData
      setSiteMsg('Settings saved');
      if (s.logoUrl) setLogoPreview(s.logoUrl);
    } catch {
      setSiteError('Save failed');
    }
  };

  // --- handlers: profile (unchanged) ---
  const onProfileChange = (e) => setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onAvatar = (e) => {
    const f = e.target.files?.[0]; setAvatarFile(f || null);
    setAvatarPreview(f ? URL.createObjectURL(f) : '');
  };
  const saveProfile = async (e) => {
    e.preventDefault(); setProfileMsg(''); setProfileError('');
    try {
      const u = await updateMyProfile(profileForm);
      setMe(u); setProfileMsg('Profile updated');
    } catch { setProfileError('Update failed'); }
  };
  const saveAvatar = async () => {
    if (!avatarFile) return;
    setProfileMsg(''); setProfileError('');
    try {
      const u = await updateMyAvatar(avatarFile);
      setMe(u); setProfileMsg('Avatar updated');
      setAvatarPreview(u.avatar || avatarPreview);
      setAvatarFile(null);
    } catch { setProfileError('Avatar update failed'); }
  };
  const savePassword = async (e) => {
    e.preventDefault(); setProfileMsg(''); setProfileError('');
    try {
      await changeMyPassword(pwForm.currentPassword, pwForm.newPassword);
      setProfileMsg('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setProfileError(err?.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold"></h2>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className={`px-3 py-2 rounded ${tab === 'site' ? 'bg-gray-900 text-white' : 'border'}`} onClick={() => setTab('site')}>
          Site Settings
        </button>
        <button className={`px-3 py-2 rounded ${tab === 'profile' ? 'bg-gray-900 text-white' : 'border'}`} onClick={() => setTab('profile')}>
          My Profile
        </button>
      </div>

      {/* SITE SETTINGS */}
      {tab === 'site' && (
        <>
          {loadingSite && <div className="text-gray-600 text-sm">Loading…</div>}
          {siteError && <div className="text-red-600 text-sm">{siteError}</div>}
          {siteMsg && <div className="text-green-700 text-sm">{siteMsg}</div>}

          {!loadingSite && (
            <form onSubmit={saveSite} className="bg-white p-4 rounded shadow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs block mb-1">Site Name</label>
                  <input name="siteName" value={siteForm.siteName} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">Contact Email</label>
                  <input name="contactEmail" value={siteForm.contactEmail} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">Contact Phone</label>
                  <input name="contactPhone" value={siteForm.contactPhone} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div className="md:col-span-2"><label className="text-xs block mb-1">Address</label>
                  <input name="address" value={siteForm.address} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs block mb-1">Privacy Policy URL</label>
                  <input name="privacyPolicyUrl" value={siteForm.privacyPolicyUrl} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">Refund Policy URL</label>
                  <input name="refundPolicyUrl" value={siteForm.refundPolicyUrl} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">Terms & Conditions URL</label>
                  <input name="termsUrl" value={siteForm.termsUrl} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="text-xs block mb-1">Facebook</label>
                  <input name="facebook" value={siteForm.facebook} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">Instagram</label>
                  <input name="instagram" value={siteForm.instagram} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">YouTube</label>
                  <input name="youtube" value={siteForm.youtube} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
                <div><label className="text-xs block mb-1">TikTok</label>
                  <input name="tiktok" value={siteForm.tiktok} onChange={onSiteChange} className="border px-3 py-2 rounded w-full" /></div>
              </div>

              <div>
                <label className="text-xs block mb-1">Logo</label>
                <div className="flex flex-wrap gap-2">
                  <input type="file" accept="image/*" onChange={onLogo} />
                  <button
                    type="button"
                    className="px-3 py-2 border rounded text-sm"
                    onClick={() => setLogoPickerOpen(true)}
                  >
                    Choose from Library
                  </button>
                  {(logoPreview || logoAsset?.secure_url) && (
                    <button
                      type="button"
                      className="px-3 py-2 border rounded text-sm"
                      onClick={() => { setLogoFile(null); setLogoAsset(null); setLogoPreview(''); }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {(logoPreview || logoAsset?.secure_url) && (
                  <img src={logoPreview || logoAsset.secure_url} alt="logo preview" className="mt-2 h-16 object-contain" />
                )}
                {logoAsset?.public_id && (
                  <div className="text-xs text-gray-500 break-all mt-1">public_id: {logoAsset.public_id}</div>
                )}
              </div>

              <button className="px-4 py-2 bg-[#7d4c35] text-white rounded">Save Settings</button>
            </form>
          )}
        </>
      )}

      {/* MY PROFILE (unchanged) */}
      {tab === 'profile' && (
        <>
          {loadingProfile && <div className="text-gray-600 text-sm">Loading…</div>}
          {profileError && <div className="text-red-600 text-sm">{profileError}</div>}
          {profileMsg && <div className="text-green-700 text-sm">{profileMsg}</div>}

          {!loadingProfile && me && (
            <div className="space-y-4">
              {/* Basic info */}
              <form onSubmit={saveProfile} className="bg-white p-4 rounded shadow space-y-3">
                <div className="text-sm font-semibold mb-2">Basic Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs block mb-1">Name</label>
                    <input name="name" value={profileForm.name} onChange={onProfileChange} className="border px-3 py-2 rounded w-full" /></div>
                  <div><label className="text-xs block mb-1">Email</label>
                    <input name="email" value={profileForm.email} onChange={onProfileChange} className="border px-3 py-2 rounded w-full" /></div>
                </div>
                <button className="px-4 py-2 bg-[#7d4c35] text-white rounded">Save Profile</button>
              </form>

              {/* Avatar */}
              <div className="bg-white p-4 rounded shadow space-y-3">
                <div className="text-sm font-semibold mb-2">Avatar</div>
                {avatarPreview && <img src={avatarPreview} alt="avatar" className="h-16 w-16 rounded-full object-cover" />}
                <input type="file" accept="image/*" onChange={onAvatar} />
                <button onClick={saveAvatar} className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50" disabled={!avatarFile}>
                  Update Avatar
                </button>
              </div>

              {/* Password */}
              <form onSubmit={savePassword} className="bg-white p-4 rounded shadow space-y-3">
                <div className="text-sm font-semibold mb-2">Change Password</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs block mb-1">Current Password</label>
                    <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="border px-3 py-2 rounded w-full" /></div>
                  <div><label className="text-xs block mb-1">New Password</label>
                    <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="border px-3 py-2 rounded w-full" /></div>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded">Change Password</button>
              </form>
            </div>
          )}
        </>
      )}

      {/* Media Picker for logo */}
      <MediaPicker
        open={logoPickerOpen}
        onClose={() => setLogoPickerOpen(false)}
        initialFolder="signnatural/logos"
        onSelect={(asset) => {
          setLogoAsset(asset);
          setLogoFile(null);                  // ensure we don't send both
          setLogoPreview(asset.secure_url);   // show selected logo
        }}
      />
    </div>
  );
}
