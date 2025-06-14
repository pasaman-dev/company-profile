import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-lg shadow-sm bg-white/5 backdrop-blur-md p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-xl font-semibold ${className}`} {...props}>{children}</h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm opacity-80 ${className}`} {...props}>{children}</p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
