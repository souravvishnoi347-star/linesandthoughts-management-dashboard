import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  iconSize?: number;
}

export function Logo({ className = '', iconSize = 48 }: LogoProps) {
  // We calculate text sizes relative to the icon size so it scales perfectly
  const mainTextSize = iconSize * 0.45; 
  const subTextSize = iconSize * 0.22;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image 
        src="/favicon.png" 
        alt="Lines & Thoughts Icon" 
        width={iconSize} 
        height={iconSize} 
        className="object-contain shrink-0"
        priority
      />
      <div className="flex flex-col justify-center">
        <div className="font-headline-md tracking-tight" style={{ fontSize: `${mainTextSize}px`, lineHeight: 1.1 }}>
          <span className="font-light">Lines & </span>
          <span className="font-extrabold">Thoughts</span>
        </div>
        <div className="font-body-md tracking-widest mt-0.5 font-medium opacity-70" style={{ fontSize: `${subTextSize}px`, lineHeight: 1 }}>
          BY KARTIK | AKSHAY
        </div>
      </div>
    </div>
  );
}
