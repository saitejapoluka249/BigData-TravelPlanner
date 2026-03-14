// larry6683/big-data-project-travel-app/frontend/components/Navbar.tsx

import React from 'react';
import { Menu, Map } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  mapOpen: boolean;
  onMapToggle: () => void;
}

export default function Navbar({ onMenuClick, mapOpen, onMapToggle }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0 z-10 shadow-sm min-h-[64px]">
      <div className="flex items-center gap-4">
        {/* Menu Button (Hidden on Desktop) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-slate-900 text-white lg:hidden hover:bg-slate-800 transition-colors"
          aria-label="Open search panel"
        >
          <Menu size={20} />
        </button>

        {/* Logo - Hidden on Desktop so it doesn't duplicate the sidebar logo */}
        <div className="flex flex-col lg:hidden">
          <div className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 md:gap-2">
            WanderPlan <span className="text-blue-600">US</span>
          </div>
        </div>
      </div>
      
      {/* Map Toggle Button (Hidden on md+ because map is always visible on Tablets/Desktop) */}
      <button
        onClick={onMapToggle}
        className={`p-2 rounded-xl text-white transition-colors md:hidden ${mapOpen ? 'bg-blue-600' : 'bg-slate-700'}`}
        aria-label="Toggle map"
      >
        <Map size={20} />
      </button>
    </nav>
  );
}