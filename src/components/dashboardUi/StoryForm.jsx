import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StoryForm({
  storyForm = {
    title: '',
    author: '',
    text: '',
    rating: 0,
    type: '',
    referenceId: '',
  },
  onChange = () => {},
  onSubmit = () => {},
  userStories = [],
  classes = [],
  workshops = [],
}) {
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setMediaFile(file);
      setError('');
    } else {
      setError('File must be 10MB or smaller.');
      setMediaFile(null);
    }
  };

  const handleRatingClick = (value) => {
    onChange({ target: { name: 'rating', value } });
  };

  const handleSubmit = () => {
    if (!storyForm.type || !storyForm.referenceId) {
      setError('Please select a class or workshop.');
      return;
    }
    if (!error) {
      onSubmit(mediaFile);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const renderStars = (value, interactive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          onClick={interactive ? () => handleRatingClick(star) : undefined}
          className={`cursor-pointer ${
            star <= value ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Story Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Post a Story</h2>
        <div className="space-y-3">
          <input
            name="title"
            placeholder="Story Title"
            value={storyForm.title}
            onChange={onChange}
            className="shadow p-3 w-full rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            name="author"
            placeholder="Your Name"
            value={storyForm.author}
            onChange={onChange}
            className="shadow p-3 w-full rounded-md focus:ring-2 focus:ring-green-500"
          />

          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="type"
              value={storyForm.type}
              onChange={onChange}
              className="shadow p-3 rounded-md w-full md:w-1/2"
            >
              <option value="">Select Type</option>
              <option value="class">Class</option>
              <option value="workshop">Workshop</option>
            </select>

            <select
              name="referenceId"
              value={storyForm.referenceId}
              onChange={onChange}
              className="shadow p-3 rounded-md w-full md:w-1/2"
              disabled={!storyForm.type}
            >
              <option value="">Select {storyForm.type || 'option'}</option>
              {(storyForm.type === 'class' ? classes : workshops).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="text"
            placeholder="Share your experience..."
            value={storyForm.text}
            onChange={onChange}
            className="shadow p-3 w-full rounded-md h-24 focus:ring-2 focus:ring-green-500"
          />

          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">Your Rating:</span>
            {renderStars(storyForm.rating, true)}
          </div>

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="shadow p-3 w-full rounded-md"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
          >
            Submit Story
          </button>

          {submitted && (
            <p className="text-green-600 animate-pulse mt-2">
              Story submitted!
            </p>
          )}

          {mediaFile && (
            <div className="mt-4">
              {mediaFile.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(mediaFile)}
                  alt="preview"
                  className="w-auto h-auto max-h-60 rounded border"
                />
              ) : (
                <video
                  controls
                  src={URL.createObjectURL(mediaFile)}
                  className="w-full h-auto max-h-60 rounded border"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shared Stories */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Shared Stories</h3>

        {userStories.length === 0 ? (
          <p className="text-gray-500">No stories yet. Be the first to share yours!</p>
        ) : (
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="min-w-[250px] max-w-sm bg-gray-50 rounded-xl p-4 shadow flex-shrink-0"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                    {getInitials(story.author)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{story.author}</p>
                    <p className="text-xs text-gray-400">{story.date || 'Today'}</p>
                  </div>
                </div>
                <div className="mb-1">{renderStars(story.rating || 0)}</div>
                <h4 className="font-semibold text-gray-700">{story.title}</h4>
                <p className="text-xs text-gray-400 italic mb-1">
                  {story.type} • {story.referenceTitle}
                </p>
                <p className="text-sm text-gray-600 line-clamp-4">{story.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
