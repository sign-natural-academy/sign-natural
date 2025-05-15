import React from 'react';

export default function StoryForm({
  storyForm = { title: '', author: '', text: '' },
  onChange = () => {},
  onSubmit = () => {},
  userStories = [],
}) {
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
      <button
        onClick={onSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit Story
      </button>

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
