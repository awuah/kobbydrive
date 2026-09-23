"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Clock, Search, X, ArrowRight, ShieldCheck } from "lucide-react";

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal automatically on page visit
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-brand-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close notice modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Icon & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Important Announcement
              </span>
              <h3 id="modal-headline" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Applications Currently Closed
              </h3>
            </div>
          </div>

          {/* Notice Message */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-800 text-sm sm:text-base leading-relaxed">
            <p>
              We are currently reviewing applications and as such, no longer accepting new applications. You can check later for when we re-open for new applications. If you are already registered and want to check the status of your application, you can{" "}
              <Link
                href="/track"
                onClick={() => setIsOpen(false)}
                className="font-bold text-brand-700 hover:text-brand-800 underline underline-offset-2 decoration-brand-500 decoration-2 transition-colors"
              >
                click here
              </Link>
              .
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href="/track"
              onClick={() => setIsOpen(false)}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4" />
              Check Application Status
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Kobby Free Driving School Initiative
          </div>
          <span>Takoradi</span>
        </div>
      </div>
    </div>
  );
}
