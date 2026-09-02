"use client";

import React, { useState } from "react";
import { Application, ApplicationStatus } from "@/lib/types";
import { formatApplicationStatus, formatDate, formatDateTime } from "@/lib/utils";
import {
  X,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Loader2,
  FileText,
  Shield,
  Activity,
} from "lucide-react";

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus, notes: string) => Promise<void>;
}

export default function ApplicationDetailsModal({
  application,
  onClose,
  onUpdateStatus,
}: ApplicationDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(application.status);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const statusInfo = formatApplicationStatus(application.status);

  const handleStatusSave = async () => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    try {
      await onUpdateStatus(application.id, selectedStatus, adminNotes);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col print-card">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold">
              KBD
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Application Dossier: {application.application_number}
              </h2>
              <p className="text-xs text-slate-400">
                Submitted on {formatDateTime(application.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Header (visible during print) */}
        <div className="p-6 border-b border-slate-200 hidden print-only">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">KobbyDrive Free Driving School</h1>
              <p className="text-xs text-slate-600">Official Candidate Application Record</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold">{application.application_number}</span>
              <p className="text-[10px] text-slate-500">{formatDate(application.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status & Quick Overview Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Current Status</span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
                >
                  {statusInfo.label}
                </span>
                <span className="text-xs text-slate-500">
                  Last updated: {formatDate(application.updated_at)}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 block">Applicant ID Reference</span>
              <span className="text-sm font-mono font-bold text-slate-800">
                {application.id_type}: {application.id_number}
              </span>
            </div>
          </div>

          {/* 14 Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Personal & Identification */}
            <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" /> 1. Personal & Identity Profile
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">1. Surname</span>
                  <span className="font-semibold text-slate-900">{application.surname}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">2. Last Name / Other Names</span>
                  <span className="font-semibold text-slate-900">{application.last_name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">4. Title</span>
                  <span className="font-semibold text-slate-900">{application.title}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">3. Gender</span>
                  <span className="font-semibold text-slate-900">{application.gender}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">7. Date of Birth</span>
                  <span className="font-semibold text-slate-900">{formatDate(application.date_of_birth)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">8. Place of Birth</span>
                  <span className="font-semibold text-slate-900">{application.place_of_birth}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">11. Nationality</span>
                  <span className="font-semibold text-slate-900">{application.nationality}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">5. ID Type</span>
                  <span className="font-semibold text-slate-900">{application.id_type}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">6. ID Number</span>
                  <span className="font-mono font-bold text-brand-700">{application.id_number}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Contact & Digital Signature */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-600" /> 2. Contact & Addresses
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">13. Phone Number</span>
                    <a
                      href={`tel:${application.phone_number}`}
                      className="font-bold text-brand-700 hover:underline flex items-center gap-1"
                    >
                      {application.phone_number}
                    </a>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">12. Email Address</span>
                    <a
                      href={`mailto:${application.email}`}
                      className="font-medium text-slate-900 hover:text-brand-600 truncate max-w-[200px]"
                    >
                      {application.email}
                    </a>
                  </div>

                  <div className="py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium block mb-0.5">10. House / Residential Address</span>
                    <span className="font-medium text-slate-900">{application.house_address}</span>
                  </div>

                  <div className="py-1">
                    <span className="text-slate-500 font-medium block mb-0.5">9. Postal Address</span>
                    <span className="font-medium text-slate-900">{application.postal_address || "None specified"}</span>
                  </div>
                </div>
              </div>

              {/* 14. Signature Card */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" /> 14. Digital Signature
                </h3>

                <div className="h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2">
                  {application.signature_data ? (
                    <img
                      src={application.signature_data}
                      alt={`Signature of ${application.surname}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 italic">No signature image attached</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Workflow & Status Action Section (Hidden in Print) */}
          <div className="border-t-2 border-slate-200 pt-6 space-y-4 no-print">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-700" /> Admin Workflow & Status Updater
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Candidate Progress
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="pending">⏳ Pending Review</option>
                  <option value="under_review">🔍 Under Review</option>
                  <option value="approved">✅ Approved Candidate</option>
                  <option value="in_training">🚗 In Training (Driving School)</option>
                  <option value="completed">🎓 Completed / Graduated</option>
                  <option value="rejected">❌ Rejected / Declined</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Internal Notes / Remarks
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified Ghana Card, scheduled for Batch 2 on Monday"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {updateSuccess ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Application updated successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-500">Changes will be reflected immediately</span>
              )}

              <button
                type="button"
                onClick={handleStatusSave}
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Save Status & Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
