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
  const mainTextSize = iconSize * 0.29; 
  const subTextSize = iconSize * 0.14;

  return (
    <div className={`flex items-center gap-4 ${montserrat.className} ${className}`}>
      <Image 
        src="/favicon.png" 
        alt="Lines & Thoughts Icon" 
        width={iconSize} 
        height={iconSize} 
        className="object-contain shrink-0"
        priority
      />
      <div className="flex flex-col justify-center mt-1.5">
        <div className="tracking-[0.18em]" style={{ fontSize: `${mainTextSize}px`, lineHeight: 1.05 }}>
          <span className="font-[300] uppercase">LINES </span>
          <span className="font-[800] uppercase">& THOUGHTS</span>
        </div>
        <div className="tracking-[0.3em] font-[500] opacity-75 mt-0.5" style={{ fontSize: `${subTextSize}px`, lineHeight: 1 }}>
          BY KARTIK | AKSHAY
        </div>
      </div>
    </div>
  );
}
