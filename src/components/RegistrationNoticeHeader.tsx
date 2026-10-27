"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clock } from "lucide-react";

export default function RegistrationNoticeHeader() {
  const [isPrivateAccess, setIsPrivateAccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token =
      params.get("access") ||
      params.get("token") ||
      params.get("invite") ||
      params.get("bypass") ||
      params.get("vip");

    if (token) {
      fetch(`/api/applications/verify-bypass?token=${encodeURIComponent(token)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsPrivateAccess(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  if (isPrivateAccess) {
    return (
      <div className="text-center mb-10 space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Private Candidate Registration
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Your Official Application
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Please fill out the form below with your accurate details. Your submission will be processed under private invitation access.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-10 space-y-2">
      <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
        Public Registration Notice
      </span>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Applications Currently Paused
      </h2>
      <p className="text-sm text-slate-600 max-w-xl mx-auto">
        We are currently reviewing applications. If you have already registered, you can track the status of your enrollment.
      </p>
    </div>
  );
}
