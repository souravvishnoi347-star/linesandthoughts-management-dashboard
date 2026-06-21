import React from 'react';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

interface LogoProps {
  className?: string;
  iconSize?: number;
}

export function Logo({ className = '', iconSize = 48 }: LogoProps) {
  // We calculate text sizes relative to the icon size so it scales perfectly
  const mainTextSize = iconSize * 0.28; 
  const subTextSize = iconSize * 0.14;

  return (
    <div className={`flex items-center gap-3 ${montserrat.className} ${className}`}>
      <Image 
        src="/favicon.png" 
        alt="Lines & Thoughts Icon" 
        width={iconSize} 
        height={iconSize} 
        className="object-contain shrink-0"
        priority
      />
      <div className="flex flex-col justify-center">
        <div className="tracking-[0.15em]" style={{ fontSize: `${mainTextSize}px`, lineHeight: 1.2 }}>
          <span className="font-light uppercase">LINES </span>
          <span className="font-bold uppercase">& THOUGHTS</span>
        </div>
        <div className="tracking-[0.25em] font-medium opacity-70 mt-1" style={{ fontSize: `${subTextSize}px`, lineHeight: 1 }}>
          BY KARTIK | AKSHAY
        </div>
      </div>
    </div>
  );
}
