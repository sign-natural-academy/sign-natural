// src/components/ui/Card.jsx
import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
