import React from 'react';

export function Button({ children, className = '', variant = 'solid', ...props }) {
  // Basic style hooks, extend via className or external CSS/Tailwind
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    solid: 'bg-teal-600 text-white hover:bg-teal-700',
    outline: 'border border-current text-white hover:bg-white/10',
    ghost: 'text-white hover:bg-white/10',
  };
  const variantClass = variants[variant] || variants.solid;
  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
