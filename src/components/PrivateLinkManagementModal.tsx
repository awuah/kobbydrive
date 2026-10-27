"use client";

import React, { useState, useEffect } from "react";
import {
  Link2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Power,
  Sparkles,
  Users,
  X,
  Loader2,
  KeyRound,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { PrivateLinkConfig } from "@/lib/private-link";

interface PrivateLinkManagementModalProps {
  onClose: () => void;
  adminPasscode: string;
}

export default function PrivateLinkManagementModal({
  onClose,
  adminPasscode,
}: PrivateLinkManagementModalProps) {
  const [config, setConfig] = useState<PrivateLinkConfig | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, [adminPasscode]);

  const fetchConfig = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/private-link", {
        headers: {
          Authorization: `Bearer ${adminPasscode}`,
        },
      });
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        setEnabled(data.config.enabled);
        setToken(data.config.token);
        setNote(data.config.note || "");
        setShareableUrl(data.shareableUrl);
      } else {
        setErrorMessage(data.error || "Failed to load private link configuration.");
      }
    } catch (err: any) {
      console.error("Error fetching private link config:", err);
      setErrorMessage(err.message || "Network error loading configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token.trim()) {
      setErrorMessage("Please provide a valid access token or passphrase.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/private-link", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPasscode}`,
        },
        body: JSON.stringify({
          enabled,
          token: token.trim(),
          note: note.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        setEnabled(data.config.enabled);
        setToken(data.config.token);
        setShareableUrl(data.shareableUrl);
        setSuccessMessage(data.message || "Settings updated successfully.");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(data.error || "Failed to update settings.");
      }
    } catch (err: any) {
      console.error("Error saving private link config:", err);
      setErrorMessage(err.message || "Network error saving configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const generateRandomToken = () => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    const newToken = `vip-${randomHex}`;
    setToken(newToken);

    // Update preview URL locally
    try {
      const parsedUrl = new URL(shareableUrl || window.location.origin);
      parsedUrl.searchParams.set("access", newToken);
      setShareableUrl(parsedUrl.toString());
    } catch (e) {}
  };

  const resetDefaultToken = () => {
    const defaultToken = "kobby-vip-2026";
    setToken(defaultToken);
    try {
      const parsedUrl = new URL(shareableUrl || window.location.origin);
      parsedUrl.searchParams.set("access", defaultToken);
      setShareableUrl(parsedUrl.toString());
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-brand-500 to-emerald-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Private Registration Link Manager
                </h2>
                {config && (
                  <span
                    className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                      enabled
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-700 text-slate-300 border-slate-600"
                    }`}
                  >
                    {enabled ? "Active" : "Disabled"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bypass public application freeze for VIP candidates and corporate cohorts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <p className="text-sm font-semibold">Loading private link settings...</p>
            </div>
          ) : (
            <>
              {/* Feedback Notifications */}
              {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Status Toggle Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  enabled
                    ? "bg-emerald-50/70 border-emerald-300/80 shadow-xs"
                    : "bg-slate-50 border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        Private Registration Bypass Status
                      </span>
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          enabled
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {enabled ? "ENABLED & ACCEPTING" : "DISABLED (BLOCKED)"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                      {enabled
                        ? "Anyone with your private link can view and submit the application form. Public visitors without the link remain paused."
                        : "Private bypass is turned OFF. Everyone visiting the website (even with a link) will see the paused application notice."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEnabled(!enabled)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                      enabled
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {enabled ? "Disable Private Link" : "Enable Private Link"}
                  </button>
                </div>
              </div>

              {/* Active Sharable URL Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Sharable Private Link
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-800 flex items-center overflow-x-auto select-all">
                    {shareableUrl || `${window?.location?.origin || ""}/?access=${token}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Link
                        </>
                      )}
                    </button>

                    <a
                      href={shareableUrl || `/?access=${token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 border border-slate-300 transition-colors"
                      title="Open link in a new tab to test registration"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Send this exact link via WhatsApp, SMS, or Email to the candidate.
                </p>
              </div>

              {/* Passphrase / Token Customizer */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      Access Passphrase / Token
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={generateRandomToken}
                      className="text-brand-600 hover:text-brand-700 font-semibold underline cursor-pointer"
                    >
                      Generate New Key
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={resetDefaultToken}
                      className="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
                      setToken(val);
                      try {
                        const parsedUrl = new URL(shareableUrl || window.location.origin);
                        parsedUrl.searchParams.set("access", val);
                        setShareableUrl(parsedUrl.toString());
                      } catch (err) {}
                    }}
                    placeholder="e.g. kobby-vip-2026"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Changing this token instantly invalidates any old links previously sent out.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Admin Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Issued for Western Regional Youth Council"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Usage Stats & Audit info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <Users className="w-3.5 h-3.5" /> Private Applicants
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {config?.usageCount || 0}
                  </div>
                  <div className="text-[10px] text-slate-500">Registered via link</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Security
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1 truncate">
                    Token Protected
                  </div>
                  <div className="text-[10px] text-slate-500">Case-insensitive</div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <FileCheck2 className="w-3.5 h-3.5" /> Last Modified
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {config?.updated_at ? new Date(config.updated_at).toLocaleDateString() : "Active"}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    by {config?.updated_by || "Admin"}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={fetchConfig}
            disabled={loading || saving}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || saving}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-brand-600/20 transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Save Link Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
