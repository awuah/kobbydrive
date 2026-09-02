"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, CheckCircle2, Shield, Search } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              Kobby<span className="text-brand-600">Drive</span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                Free Program
              </span>
            </span>
            <p className="text-xs text-slate-500 hidden sm:block">Empowering Future Drivers</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Apply Now
          </Link>

          <Link
            href="/track"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname === "/track"
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Track</span> Status
          </Link>

          <Link
            href="/admin"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/admin")
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span> Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
