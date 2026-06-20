import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex-col mb-4 ${className}`}>
      {label && <label className="mb-2 font-semibold text-sm">{label}</label>}
      <input className={`input-field ${error ? 'border-danger' : ''}`} {...props} />
      {error && <span className="text-danger text-sm mt-1">{error}</span>}
    </div>
  );
}
