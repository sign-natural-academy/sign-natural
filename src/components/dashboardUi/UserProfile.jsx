import React, { useState, useRef } from 'react';

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', profile);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 transition">
      {/* User Profile Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
        <div className="relative w-36 h-36 mb-4">
          <img
            src={profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-4 border-green-200 shadow-sm transition"
          />
        </div>

        {/* File Input Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleFileClick}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
        >
          Choose New Profile Picture
        </button>

        <h3 className="mt-4 text-lg font-semibold">{profile.name}</h3>
        <p className="text-sm text-gray-500">{profile.email}</p>
        <p className="text-xs text-gray-400 mt-1">Member since: Jan 2024</p>
      </div>

      {/* Update Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="md:col-span-2 bg-white shadow-md rounded-2xl p-6 transition"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Update Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={profile.currentPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
