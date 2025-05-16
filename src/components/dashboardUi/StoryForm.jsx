import React, { useState } from 'react';

export default function StoryForm({
  storyForm = { title: '', author: '', text: '' },
  onChange = () => {},
  onSubmit = () => {},
  userStories = [],
}) {
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState('');
   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setMediaFile(file);
      setError('');
    } else {
      setError('File size must be less than or equal to 10MB.');
      setMediaFile(null);
    }
  };
  return (
    <div className="space-y-2">
      <input
        name="title"
        placeholder="Story Title"
        value={storyForm.title}
        onChange={onChange}
        className="border p-2 w-full rounded"
      />
      <input
        name="author"
        placeholder="Author Name"
        value={storyForm.author}
        onChange={onChange}
        className="border p-2 w-full rounded"
      />
      <textarea
        name="text"
        placeholder="Write your story..."
        value={storyForm.text}
        onChange={onChange}
        className="border p-2 w-full rounded h-24"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="border p-2 w-full rounded"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
       <button
        onClick={() => {
          if (!error) {
            onSubmit(mediaFile); // Pass file to parent
          }
        }}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit Story
      </button>

       {mediaFile && (
        <div className="mt-2">
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


      <div className="mt-4 space-y-2">
        {userStories.map((story) => (
          <div key={story.id} className="border p-2 rounded">
            <h4 className="font-semibold">
              {story.title}{' '}
              <span className="text-xs text-gray-400">by {story.author}</span>
            </h4>
            <p className="text-sm text-gray-700">{story.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
