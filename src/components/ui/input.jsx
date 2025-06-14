import React from 'react';

export function Input({ className = '', ...props }) {
  const base = 'w-full px-3 py-2 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500';
  return <input className={`${base} ${className}`} {...props} />;
}

export default Input;
