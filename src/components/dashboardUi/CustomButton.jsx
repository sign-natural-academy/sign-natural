import React from 'react';
import { cn } from '@/lib/utils';
// Button Component
export function CustomButton({ className, children, ...props }) {
  return (
    <button
      className={cn(
        'bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
