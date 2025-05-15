import React, { useState } from 'react';

export default function UpdateProfileForm() {
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Submit logic here
    console.log('Updated profile:', profile);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="col-span-2 bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <hr className="my-4" />

        <h3 className="text-md font-semibold mb-2">Change Password</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={profile.currentPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      {/* Profile Picture + Actions */}
      <div className="col-span-1 flex flex-col items-center bg-white p-6 rounded-lg shadow">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full w-full h-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute bottom-0 left-0 text-xs text-gray-600"
          />
        </div>
        <h3 className="text-lg font-semibold mb-1">{profile.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{profile.email}</p>

        <button className="text-blue-600 mb-2 hover:underline">Login</button>
        <button className="text-red-500 hover:underline">Logout</button>
      </div>
    </div>
  );
}
