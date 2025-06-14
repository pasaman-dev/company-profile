import React from 'react';

export function Textarea({ className = '', rows = 4, ...props }) {
  const base = 'w-full px-3 py-2 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500';
  return <textarea rows={rows} className={`${base} ${className}`} {...props} />;
}

export default Textarea;
