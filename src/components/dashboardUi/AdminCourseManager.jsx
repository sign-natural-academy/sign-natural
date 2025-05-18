import React, { useState, useEffect } from 'react';

export default function AdminCourseManager() {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    location: '',
    status: 'Active',
    image: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminClasses');
    if (stored) {
      setClasses(JSON.parse(stored));
    } else {
      const initial = [
        {
          id: 1,
          title: 'Shea Butter Masterclass',
          type: 'Online',
          location: '-',
          status: 'Active',
          image: 'https://source.unsplash.com/featured/?shea,butter',
        },
        {
          id: 2,
          title: 'Skincare Workshop Accra',
          type: 'In-Person',
          location: 'Accra',
          status: 'Upcoming',
          image: 'https://source.unsplash.com/featured/?skincare,workshop',
        },
        {
          id: 3,
          title: 'Black Soap Making',
          type: 'Online',
          location: '-',
          status: 'Completed',
          image: 'https://source.unsplash.com/featured/?soap,organic',
        },
        {
          id: 4,
          title: 'Essential Oils Class',
          type: 'On-Demand',
          location: '-',
          status: 'Active',
          image: 'https://source.unsplash.com/featured/?essential,oils',
        },
        {
          id: 5,
          title: 'Natural Hair Care Workshop',
          type: 'In-Person',
          location: 'Kumasi',
          status: 'Upcoming',
          image: 'https://source.unsplash.com/featured/?natural,hair',
        },
      ];
      setClasses(initial);
      localStorage.setItem('adminClasses', JSON.stringify(initial));
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.status || !formData.image) {
      return alert('Please fill in all required fields.');
    }

    if (editingId) {
      const updated = classes.map((item) =>
        item.id === editingId ? { ...item, ...formData, id: editingId } : item
      );
      setClasses(updated);
      localStorage.setItem('adminClasses', JSON.stringify(updated));
      setEditingId(null);
    } else {
      const newClass = {
        ...formData,
        id: Date.now(),
      };
      const updated = [newClass, ...classes];
      setClasses(updated);
      localStorage.setItem('adminClasses', JSON.stringify(updated));
    }

    setFormData({
      title: '',
      type: '',
      location: '',
      status: 'Active',
      image: '',
    });
  };

  const handleDelete = (id) => {
    const filtered = classes.filter((item) => item.id !== id);
    setClasses(filtered);
    localStorage.setItem('adminClasses', JSON.stringify(filtered));
  };

  const handleEdit = (cls) => {
    setFormData(cls);
    setEditingId(cls.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Classes & Workshops</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
            <option value="On-Demand">On-Demand</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            className="border p-2 rounded"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="col-span-2"
          />
        </div>
        {formData.image && (
          <img src={formData.image} alt="Preview" className="h-32 w-32 object-cover rounded" />
        )}
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {editingId ? 'Update Class' : 'Add Class'}
        </button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all"
          >
            <img src={cls.image} alt={cls.title} className="h-40 w-full object-cover" />
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-bold text-gray-800">{cls.title}</h3>
              <p className="text-sm text-gray-600">Type: {cls.type}</p>
              <p className="text-sm text-gray-600">Location: {cls.location}</p>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                  cls.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : cls.status === 'Upcoming'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {cls.status}
              </span>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleEdit(cls)}
                  className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
