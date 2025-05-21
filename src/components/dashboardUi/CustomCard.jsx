import React from 'react';
import { cn } from '@/lib/utils';

// Card Component
export function CustomCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-2xl shadow p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}