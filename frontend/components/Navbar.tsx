// larry6683/big-data-project-travel-app/frontend/components/Navbar.tsx

import React from "react";
import { Menu, Map, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
  mapOpen: boolean;
  onMapToggle: () => void;
}

export default function Navbar({
  onMenuClick,
  mapOpen,
  onMapToggle,
}: NavbarProps) {
  // 🌟 Added: Consume Auth state
  const { user, logout, isLoggedIn } = useAuth();

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

      {/* 🌟 Added: Auth Section */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* Desktop User Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <UserIcon size={16} />
              <span className="text-sm font-semibold">{user}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline text-sm font-medium">
                Logout
              </span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 text-sm font-bold"
          >
            <UserIcon size={18} />
            Login / Sign Up
          </Link>
        )}

        {/* Existing Map Toggle Button (Mobile Only) */}
        <button
          onClick={onMapToggle}
          className={`p-2 rounded-xl text-white transition-colors md:hidden ${
            mapOpen ? "bg-blue-600" : "bg-slate-700"
          }`}
          aria-label="Toggle map"
        >
          <Map size={20} />
        </button>
      </div>
    </nav>
  );
}
