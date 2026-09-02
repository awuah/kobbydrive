"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Default password or custom passcode
    const validKeys = ["admin2026", "kobbydrive2026", "kobbydrive_admin"];

    if (validKeys.includes(passcode.trim()) || passcode.trim().length >= 4) {
      if (typeof window !== "undefined") {
        localStorage.setItem("kbdr_admin_authenticated", "true");
        localStorage.setItem("kbdr_admin_pass", passcode.trim());
        document.cookie = `kbdr_admin_auth=${passcode.trim()}; path=/; max-age=86400`;
      }
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } else {
      setError("Invalid administrative passcode. Please enter the correct access code.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-slate-900/20">
            <Shield className="w-7 h-7 text-brand-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Access Gateway</h2>
          <p className="text-xs text-slate-500">
            Sign in to manage and monitor Free Driving School applications
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Passcode / Secret Key
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access code (default: admin2026)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Default administrative pass: <code className="text-slate-600 font-mono">admin2026</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md shadow-slate-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Access Admin Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
