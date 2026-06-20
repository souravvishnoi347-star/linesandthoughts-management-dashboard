import React from 'react';
import Image from 'next/image';

export function Topbar() {
  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-40 bg-surface/70 backdrop-blur-md docked border-b border-outline-variant/20 duration-150 ease-in-out">
      <div className="flex items-center gap-4 flex-1">
        <div className="md:hidden flex items-center bg-white p-1 rounded-lg shadow-sm">
          <Image src="/logo.png" alt="Logo" width={140} height={40} className="object-contain" priority />
        </div>
        
        {/* Search on Left (Desktop) */}
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 w-96 border border-outline-variant/30 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
          <input type="text" placeholder="Search projects, vendors, or materials..." className="bg-transparent border-none outline-none text-on-surface font-body-md w-full placeholder-on-surface-variant focus:ring-0 p-0 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150 ease-in-out relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
        </button>
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150 ease-in-out hidden sm:block">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-8 w-8 ml-2 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer bg-primary-container flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-[16px]">person</span>
        </div>
      </div>
    </header>
  );
}
