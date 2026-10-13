"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  Search, 
  Shield, 
  Briefcase, 
  Sparkles, 
  ShoppingBag, 
  GraduationCap, 
  Tv, 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  const navLinks = [
    { href: "/recruitment", label: "Hire Drivers", icon: Briefcase },
    { href: "/drivers-club", label: "Drivers Club", icon: Sparkles },
    { href: "/refresher-courses", label: "Refresher Courses", icon: GraduationCap },
    { href: "/store", label: "Merch Store", icon: ShoppingBag },
    { href: "/simulator-ads", label: "Simulator Ads", icon: Tv },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-white border border-slate-200 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="KobbyDrive Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              Kobby <span className="text-brand-600">Free Driving School</span>
            </span>
            <p className="text-[11px] text-slate-500 hidden sm:block">Empowering Future Drivers</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Home / Apply
          </Link>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons (Track & Admin) */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/track"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname === "/track"
                ? "bg-brand-50 text-brand-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Track Status
          </Link>

          <Link
            href="/admin"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/admin")
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/track"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Track</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 text-sm font-medium rounded-lg ${
              pathname === "/" ? "bg-brand-50 text-brand-700 font-bold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Home / Apply
          </Link>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive ? "bg-brand-50 text-brand-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-brand-600" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
            >
              Track Application
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-slate-900 rounded-lg"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
