import React from 'react';

export function Badge({ children, className = '', ...props }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-600 text-white ${className}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;
