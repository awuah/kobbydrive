"use client";

import React, { useState } from "react";
import { AlertCircle, X, ShieldAlert, Loader2, Check } from "lucide-react";

interface RejectionReasonModalProps {
  isOpen: boolean;
  targetDescription: string; // e.g. "Kwame Mensah (KBD-2026-0042)" or "5 selected candidate(s)"
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  isLoading?: boolean;
}

const COMMON_REASONS = [
  "Does not reside or vote within Takoradi constituency",
  "Age requirement not met (must be 18 years or older)",
  "Invalid or unverified Ghana Card / National ID details",
  "Incomplete documentation or unclear passport photo",
  "Duplicate application submission detected",
  "Applicant already enrolled in another training batch",
  "Failed initial background or eligibility verification",
];

export default function RejectionReasonModal({
  isOpen,
  targetDescription,
  onClose,
  onConfirm,
  isLoading = false,
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a valid reason for rejection. This is required for audit logs.");
      return;
    }
    setError(null);
    onConfirm(reason.trim());
  };

  const handleSelectPreset = (preset: string) => {
    setReason(preset);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Reject Application</h3>
              <p className="text-xs text-rose-100">Mandatory audit reason required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <span className="font-bold">Target:</span> {targetDescription}
            <p className="text-[11px] text-rose-700 mt-1">
              All rejection reasons are permanently logged and audited by the Superadmin.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quick Select Common Reason:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {COMMON_REASONS.map((preset, idx) => {
                const isSelected = reason === preset;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium text-left transition-colors border ${
                      isSelected
                        ? "bg-rose-100 border-rose-400 text-rose-900 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 text-rose-600" />}
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Reason Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              placeholder="Provide clear reasons explaining why this application is being rejected..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              required
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Rejecting...
                </>
              ) : (
                "Confirm & Reject Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
