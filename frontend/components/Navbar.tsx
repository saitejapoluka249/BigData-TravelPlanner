// frontend/components/Navbar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Map,
  LogOut,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface NavbarProps {
  onMenuClick?: () => void;
  mapOpen?: boolean;
  onMapToggle?: () => void;
}

export default function Navbar({
  onMenuClick = () => {},
  mapOpen = false,
  onMapToggle = () => {},
}: NavbarProps) {
  const { user, logout, isLoggedIn } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative flex items-center justify-between px-4 md:px-6 py-3 border-b border-theme-surface bg-theme-bg flex-shrink-0 z-[60] shadow-sm min-h-[64px]">
      
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-theme-text text-theme-bg lg:hidden hover:bg-theme-text/80 transition-colors"
          aria-label="Open search panel"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col lg:hidden">
          <Link href="/" className="text-xl md:text-2xl font-extrabold text-theme-text tracking-tight flex items-center gap-1.5 md:gap-2">
            WanderPlan <span className="text-theme-primary">US</span>
          </Link>
        </div>
        {/* Added a Desktop logo specifically for pages without the Sidebar */}

      </div>

      <div className="hidden md:flex flex-1 justify-center lg:justify-start max-w-xl px-4 lg:pl-12">
        <div className="relative w-full md:w-[300px] flex items-center group">
          <Sparkles size={16} className="absolute left-4 text-theme-secondary z-10" />
          <input 
            type="text"
            placeholder="Ask AI to plan your trip..."
            className="w-full pl-11 pr-5 py-2 bg-gradient-to-r from-theme-surface to-theme-bg text-theme-primary placeholder:text-theme-primary/70 border border-theme-secondary/30 rounded-full focus:outline-none focus:ring-2 focus:ring-theme-secondary focus:bg-theme-bg focus:shadow-md shadow-sm transition-all text-sm font-semibold"
          />
        </div>
      </div>  

      <div className="flex items-center justify-end gap-3 flex-shrink-0">
        <button className="md:hidden p-2 rounded-xl bg-theme-surface text-theme-primary">
          <Sparkles size={20} />
        </button>

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-theme-surface text-theme-text rounded-lg border border-theme-surface hover:bg-theme-secondary/20 transition-colors"
            >
              <UserIcon size={16} />
              <span className="text-sm font-semibold hidden sm:block max-w-[120px] truncate">
                {user}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-theme-bg rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-theme-surface py-1.5 z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-text hover:bg-theme-surface font-medium transition-colors"
                >
                  <UserIcon size={16} className="text-theme-muted" />
                  Profile
                </Link>
                <Link
                  href="/savedtrips"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-text hover:bg-theme-surface font-medium transition-colors"
                >
                  <Bookmark size={16} className="text-theme-primary" />
                  Saved Trips
                </Link>
                
                <div className="h-px bg-theme-surface my-1.5 mx-2"></div>
                
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                >
                  <LogOut size={16} className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-theme-primary text-theme-bg rounded-xl hover:bg-theme-secondary transition-colors shadow-md shadow-theme-primary/30 text-sm font-bold"
          >
            <UserIcon size={18} />
            Login / Sign Up
          </Link>
        )}

        <button
          onClick={onMapToggle}
          className={`p-2 rounded-xl text-theme-bg transition-colors md:hidden ${
            mapOpen ? "bg-theme-primary" : "bg-theme-muted"
          }`}
          aria-label="Toggle map"
        >
          <Map size={20} />
        </button>
      </div>
    </nav>
  );
}