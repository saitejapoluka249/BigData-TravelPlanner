// frontend/app/profile/page.tsx
"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { User, LogOut, Bookmark, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-theme-bg">
        <h1 className="text-2xl font-bold text-theme-text mb-4">
          Please login to view your profile
        </h1>
        <Link
          href="/auth"
          className="bg-theme-primary text-theme-bg px-6 py-2 rounded-lg hover:bg-theme-secondary transition-colors font-bold"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg relative flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 animate-in fade-in duration-300">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-theme-text tracking-tight">
            My Profile
          </h1>
          <p className="text-theme-text/70 font-medium mt-1">
            Manage your personal information and preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Profile Card */}
          <div className="col-span-1">
            <div className="bg-theme-surface rounded-2xl p-6 border border-theme-muted/30 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-theme-primary/20 text-theme-primary rounded-full flex items-center justify-center mb-4">
                <User size={48} />
              </div>
              <h2 className="text-xl font-bold text-theme-text mb-1">
                {user}
              </h2>
              <p className="text-theme-text/60 text-sm font-medium mb-6">
                Adventurer
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Quick Links */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-theme-surface rounded-2xl p-6 border border-theme-muted/30 shadow-sm">
              <h3 className="text-lg font-black text-theme-text mb-4 flex items-center gap-2">
                <Settings size={20} className="text-theme-muted" /> Account Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-theme-text/60 uppercase tracking-widest mb-1">Username</label>
                  <div className="w-full p-3 bg-theme-bg border border-theme-muted/30 rounded-xl text-theme-text font-medium">
                    {user}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-text/60 uppercase tracking-widest mb-1">Email Address</label>
                  <div className="w-full p-3 bg-theme-bg border border-theme-muted/30 rounded-xl text-theme-text/60 font-medium italic">
                    (Email not provided)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-theme-surface rounded-2xl p-6 border border-theme-muted/30 shadow-sm">
              <h3 className="text-lg font-black text-theme-text mb-4 flex items-center gap-2">
                <Bookmark size={20} className="text-theme-primary" /> Quick Links
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/savedtrips" className="flex items-center gap-3 p-4 rounded-xl bg-theme-bg border border-theme-muted/30 hover:border-theme-primary transition-colors group">
                  <div className="p-2 bg-theme-primary/10 text-theme-primary rounded-lg group-hover:bg-theme-primary group-hover:text-theme-bg transition-colors">
                    <Bookmark size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-theme-text group-hover:text-theme-primary transition-colors">Saved Trips</h4>
                    <p className="text-xs text-theme-text/60 mt-0.5">View your planned itineraries</p>
                  </div>
                </Link>

                <Link href="/" className="flex items-center gap-3 p-4 rounded-xl bg-theme-bg border border-theme-muted/30 hover:border-theme-secondary transition-colors group">
                  <div className="p-2 bg-theme-secondary/10 text-theme-secondary rounded-lg group-hover:bg-theme-secondary group-hover:text-theme-bg transition-colors">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-theme-text group-hover:text-theme-secondary transition-colors">Plan New Trip</h4>
                    <p className="text-xs text-theme-text/60 mt-0.5">Start a brand new adventure</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}