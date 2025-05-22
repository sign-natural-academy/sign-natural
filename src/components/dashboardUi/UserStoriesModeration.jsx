import React, { useEffect, useState } from 'react';

const dummyStories = [
  {
    id: 1,
    type: 'Success Story',
    name: 'Ama Serwah',
    message: 'From side hustle to full-time skincare entrepreneur!',
    image: 'https://via.placeholder.com/150',
    video: '',
    status: 'Pending',
    submittedAt: '2025-05-15T10:30:00Z',
    history: [],
  },
  {
    id: 2,
    type: 'Success Story',
    name: 'Kwame Nkrumah',
    message: 'Graduated and launched my natural product line!',
    image: '',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    status: 'Approved',
    submittedAt: '2025-05-14T08:15:00Z',
    history: [{ action: 'Approved', date: '2025-05-14T12:00:00Z' }],
  },
  {
    id: 3,
    type: 'Success Story',
    name: 'Efua Mensah',
    message: 'My products now sell nationwide!',
    image: 'https://via.placeholder.com/150',
    video: '',
    status: 'Rejected',
    submittedAt: '2025-05-12T13:45:00Z',
    history: [{ action: 'Rejected', date: '2025-05-12T16:00:00Z' }],
  },
  {
    id: 4,
    type: 'Success Story',
    name: 'Yaw Boateng',
    message: 'Turned my skincare passion into profit.',
    image: '',
    video: 'https://www.w3schools.com/html/movie.mp4',
    status: 'Pending',
    submittedAt: '2025-05-10T09:30:00Z',
    history: [],
  },
  {
    id: 5,
    type: 'Success Story',
    name: 'Akosua Addo',
    message: 'Now mentoring others in skincare.',
    image: 'https://via.placeholder.com/150',
    video: '',
    status: 'Approved',
    submittedAt: '2025-05-09T11:00:00Z',
    history: [{ action: 'Approved', date: '2025-05-09T14:00:00Z' }],
  },
  {
    id: 6,
    type: 'Testimonial',
    name: 'Josephine Ofori',
    message: 'The workshops are very practical and helpful.',
    image: '',
    video: '',
    status: 'Pending',
    submittedAt: '2025-05-11T15:30:00Z',
    history: [],
  },
  {
    id: 7,
    type: 'Testimonial',
    name: 'Kojo Antwi',
    message: 'Amazing instructors and community!',
    image: '',
    video: '',
    status: 'Approved',
    submittedAt: '2025-05-08T10:00:00Z',
    history: [{ action: 'Approved', date: '2025-05-08T12:00:00Z' }],
  },
  {
    id: 8,
    type: 'Testimonial',
    name: 'Abena Appiah',
    message: 'Really changed how I take care of my skin.',
    image: 'https://via.placeholder.com/150',
    video: '',
    status: 'Pending',
    submittedAt: '2025-05-07T14:45:00Z',
    history: [],
  },
  {
    id: 9,
    type: 'Testimonial',
    name: 'Michael Tetteh',
    message: 'I recommend this academy to everyone!',
    image: '',
    video: '',
    status: 'Rejected',
    submittedAt: '2025-05-06T17:30:00Z',
    history: [{ action: 'Rejected', date: '2025-05-06T19:00:00Z' }],
  },
  {
    id: 10,
    type: 'Testimonial',
    name: 'Esi Nyarko',
    message: 'Supportive instructors and great resources.',
    image: '',
    video: '',
    status: 'Approved',
    submittedAt: '2025-05-05T11:30:00Z',
    history: [{ action: 'Approved', date: '2025-05-05T13:30:00Z' }],
  },
];

export default function UserStoriesModeration() {
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // const res = await fetch('/api/admin/stories');
        // const data = await res.json();
        // setStories(data);
        setStories(dummyStories);
      } catch (error) {
        console.error('Error fetching:', error);
        setStories(dummyStories);
      }
    };
    fetchStories();
  }, []);

  const handleModeration = (id, action) => {
    setStories(prev =>
      prev.map(story =>
        story.id === id
          ? {
              ...story,
              status: action,
              history: [
                ...story.history,
                { action, date: new Date().toISOString() },
              ],
            }
          : story
      )
    );
  };

  const filteredStories =
    filter === 'All' ? stories : stories.filter(s => s.status === filter);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Moderate Stories & Testimonials</h2>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredStories.map(story => (
          <div key={story.id} className="bg-white shadow p-4 rounded space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">{story.name}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                story.status === 'Approved'
                  ? 'bg-green-100 text-green-600'
                  : story.status === 'Rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {story.status}
              </span>
            </div>
            <p className="text-sm italic text-gray-700">{story.message}</p>
            {story.image && (
              <img src={story.image} alt="Story" className="w-full h-40 object-cover rounded" />
            )}
            {story.video && (
              <video controls className="w-full rounded">
                <source src={story.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <p className="text-xs text-gray-500">
              Submitted: {new Date(story.submittedAt).toLocaleString()}
            </p>

            {story.history.length > 0 && (
              <div className="text-xs text-gray-500">
                <strong>History:</strong>
                <ul className="list-disc ml-4">
                  {story.history.map((h, idx) => (
                    <li key={idx}>
                      {h.action} on {new Date(h.date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {story.status === 'Pending' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleModeration(story.id, 'Approved')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleModeration(story.id, 'Rejected')}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
