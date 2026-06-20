import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ children, glass = false, className = '', ...props }: CardProps) {
  const baseClass = glass ? 'glass-panel p-6' : 'card';
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
