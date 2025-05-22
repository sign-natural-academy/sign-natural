// src/components/ui/Button.jsx
import React from 'react';

export default function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
}
