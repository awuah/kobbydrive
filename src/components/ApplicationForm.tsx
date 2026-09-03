"use client";

import React, { useState } from "react";
import SignaturePad from "./SignaturePad";
import {
  Car,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ShieldCheck,
  Printer,
  Copy,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface FormState {
  surname: string;
  last_name: string;
  gender: string;
  title: string;
  id_type: string;
  id_number: string;
  date_of_birth: string;
  place_of_birth: string;
  postal_address: string;
  house_number: string;
  house_address: string;
  nationality: string;
  email: string;
  phone_number: string;
  electoral_area: string;
  training_purpose: string;
  signature_data: string;
  agreed_terms: boolean;
}

const initialFormState: FormState = {
  surname: "",
  last_name: "",
  gender: "Male",
  title: "Mr",
  id_type: "Ghana Card",
  id_number: "",
  date_of_birth: "",
  place_of_birth: "",
  postal_address: "",
  house_number: "",
  house_address: "",
  nationality: "Ghanaian",
  email: "",
  phone_number: "",
  electoral_area: "",
  training_purpose: "Personal",
  signature_data: "",
  agreed_terms: false,
};

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    application_number: string;
    submitted_at: string;
    form: FormState;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): string | null => {
    if (!form.surname.trim()) return "Please enter your Surname.";
    if (!form.last_name.trim()) return "Please enter your First / Other Names.";
    if (!form.gender) return "Please select your Gender.";
    if (!form.title) return "Please select your Title.";
    if (!form.id_type) return "Please select your ID Type.";
    if (!form.id_number.trim()) return "Please provide your ID Number.";
    if (!form.date_of_birth) return "Please provide your Date of Birth.";
    if (!form.place_of_birth.trim()) return "Please enter your Place of Birth.";
    if (!form.house_number.trim()) return "Please provide your House No.";
    if (!form.house_address.trim()) return "Please provide your House Address / Residential Address.";
    if (!form.nationality.trim()) return "Please provide your Nationality.";
    if (!form.email.trim() || !form.email.includes("@")) return "Please provide a valid Email Address.";
    if (!form.phone_number.trim() || form.phone_number.length < 8)
      return "Please provide a valid Phone Number.";
    if (!form.electoral_area)
      return "Please select where you live or vote in Takoradi constituency.";
    if (!form.training_purpose)
      return "Please select what you will use the driver training for.";
    if (!form.signature_data) return "Digital signature is required. Please sign in the box below.";
    if (!form.agreed_terms)
      return "Please agree to the declaration and program terms before submitting.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 400, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application. Please try again.");
      }

      setSubmittedData({
        application_number: data.data.application_number,
        submitted_at: new Date().toISOString(),
        form: { ...form },
      });

      // Fire celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (submittedData) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print-card">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-brand-600 to-emerald-600 p-6 sm:p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Application Successfully Submitted!
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md mx-auto">
              Your application for the KobbyDrive Free Driving School Program has been received and registered.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 text-center">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                Your Official Application Reference Number
              </span>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-brand-700 tracking-wider">
                  {submittedData.application_number}
                </span>
                <button
                  onClick={() => copyToClipboard(submittedData.application_number)}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Copy Application Number"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && <p className="text-xs text-brand-600 font-medium mt-1">Copied to clipboard!</p>}
              <p className="text-xs text-slate-500 mt-3">
                Save this number to track your application progress and training schedule online.
              </p>
            </div>

            {/* Applicant Summary Dossier */}
            <div className="border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 text-base border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" /> Applicant Summary Slip
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 text-xs block">Full Name</span>
                  <span className="font-semibold text-slate-900">
                    {submittedData.form.title} {submittedData.form.surname} {submittedData.form.last_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Gender & Nationality</span>
                  <span className="font-medium text-slate-800">
                    {submittedData.form.gender} • {submittedData.form.nationality}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Identification</span>
                  <span className="font-medium text-slate-800">
                    {submittedData.form.id_type}: {submittedData.form.id_number}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Date & Place of Birth</span>
                  <span className="font-medium text-slate-800">
                    {submittedData.form.date_of_birth} ({submittedData.form.place_of_birth})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Contact Phone</span>
                  <span className="font-medium text-slate-800">{submittedData.form.phone_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Email Address</span>
                  <span className="font-medium text-slate-800">{submittedData.form.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Training Purpose</span>
                  <span className="font-semibold text-brand-700">{submittedData.form.training_purpose}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Takoradi Electoral Area</span>
                  <span className="font-semibold text-slate-900">{submittedData.form.electoral_area}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">House No.</span>
                  <span className="font-semibold text-slate-900">{submittedData.form.house_number}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-xs block">House / Residential Address</span>
                  <span className="font-medium text-slate-800">{submittedData.form.house_address}</span>
                </div>
              </div>

              {/* Signature Preview */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Applicant Signature</span>
                  <span className="text-[10px] text-slate-400">Digitally Verified</span>
                </div>
                <div className="h-12 w-32 border border-slate-200 rounded bg-slate-50 flex items-center justify-center p-1">
                  <img
                    src={submittedData.form.signature_data}
                    alt="Applicant Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 no-print">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Application Slip
              </button>

              <Link
                href={`/track?ref=${submittedData.application_number}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand-600/20"
              >
                Track Status Online <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Please correct the following:</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Section 1: Personal Details */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
            1
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">Provide your official names and personal details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              4. Title <span className="text-rose-500">*</span>
            </label>
            <select
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            >
              <option value="Mr">Mr.</option>
              <option value="Mrs">Mrs.</option>
              <option value="Miss">Miss</option>
              <option value="Ms">Ms.</option>
              <option value="Dr">Dr.</option>
              <option value="Rev">Rev.</option>
            </select>
          </div>

          {/* Surname */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              1. Surname <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              placeholder="e.g. Mensah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>

          {/* First / Other Names */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              2. First / Other Names <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="e.g. Kwabena Emmanuel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Gender (Male/Female) <span className="text-rose-500">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              7. Date of Birth <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              8. Place of Birth <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="place_of_birth"
              value={form.place_of_birth}
              onChange={handleChange}
              placeholder="e.g. Kumasi / Accra"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 2: Identification & Nationality */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
            2
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Identification & Nationality</h3>
            <p className="text-xs text-slate-500">Official government-issued ID details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* ID Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              5. ID Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="id_type"
              value={form.id_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            >
              <option value="Ghana Card">Ghana Card (National ID)</option>
              <option value="Passport">Passport</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Driver's License / Permit">Driver&apos;s License / Learner Permit</option>
              <option value="Other">Other ID</option>
            </select>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              6. ID Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
              placeholder="e.g. GHA-712345678-9"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium uppercase"
              required
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              11. Nationality <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder="e.g. Ghanaian"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 3: Contact & Residence */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
            3
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Contact & Address</h3>
            <p className="text-xs text-slate-500">How we can reach you for training schedules and updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              13. Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="e.g. 0244123456 or +233 24 412 3456"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              12. Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. applicant@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Postal Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              9. Postal Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="postal_address"
              value={form.postal_address}
              onChange={handleChange}
              placeholder="e.g. P.O. Box 1234, Takoradi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
            />
          </div>

          {/* House No. */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              10. House No. <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="house_number"
              value={form.house_number}
              onChange={handleChange}
              placeholder="e.g. H/No 24, Block C, or WS-123-4567"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>

          {/* House Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              House Address / Street Name / Locality <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="house_address"
              value={form.house_address}
              onChange={handleChange}
              placeholder="e.g. Near Market Circle, Beach Road, Takoradi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
              required
            />
          </div>

          {/* Where do you live or vote in Takoradi Constituency */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Where do you live or vote in Takoradi Constituency? <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <select
                name="electoral_area"
                value={form.electoral_area}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
                required
              >
                <option value="" disabled>
                  -- Select where you live or vote in Takoradi --
                </option>
                <option value="Amanful West">1. Amanful West</option>
                <option value="Amanful East">2. Amanful East</option>
                <option value="Beach Road">3. Beach Road</option>
                <option value="Essikafo Ambitem No. 1">4. Essikafo Ambitem No. 1</option>
                <option value="Essikafo Ambitem No. 2">5. Essikafo Ambitem No. 2</option>
                <option value="Chapel Hill">6. Chapel Hill</option>
                <option value="Railway & Harbour">7. Railway & Harbour</option>
                <option value="New-Takoradi Lower">8. New-Takoradi Lower</option>
                <option value="Poasi - Upper New-Takoradi">9. Poasi - Upper New-Takoradi</option>
                <option value="Airforce">10. Airforce</option>
                <option value="Old Adra">11. Old Adra</option>
                <option value="Cassava Farm">12. Cassava Farm</option>
                <option value="Zenith">13. Zenith</option>
                <option value="Airport Ridge">14. Airport Ridge</option>
                <option value="Presby">15. Presby</option>
                <option value="Other">16. Other</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Select your local voting electoral area or resident locality within Takoradi constituency
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Training Purpose */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
            4
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Driver Training Objective</h3>
            <p className="text-xs text-slate-500">Specify your intended application and career goal for this training</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
            What will you use the driver training for? <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: "Personal", letter: "A", label: "Personal", desc: "Private driving for daily commutes and family use" },
              { id: "Commercial Driver", letter: "B", label: "Commercial Driver", desc: "Taxi, ride-hailing, trotro, bus, or haulage transport" },
              { id: "Agricultural", letter: "C", label: "Agricultural", desc: "Farm machinery, tractors, and agricultural logistics" },
              { id: "Private", letter: "D", label: "Private", desc: "Dedicated personal / corporate chauffeur and executive transport" },
              { id: "Equipment Handling", letter: "E", label: "Equipment Handling", desc: "Forklifts, earthmovers, construction, and heavy machinery" },
            ].map((opt) => {
              const isSelected = form.training_purpose === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isSelected
                      ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center ${
                        isSelected
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <input
                      type="radio"
                      name="training_purpose"
                      value={opt.id}
                      checked={isSelected}
                      onChange={handleChange}
                      className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                      required
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{opt.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 5: Signature & Declaration */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
            5
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Digital Signature & Declaration</h3>
            <p className="text-xs text-slate-500">Sign to authenticate your free driving school application</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            14. Applicant Digital Signature <span className="text-rose-500">*</span>
          </label>
          <SignaturePad
            value={form.signature_data}
            onChange={(sig) => setForm((prev) => ({ ...prev, signature_data: sig }))}
            disabled={loading}
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreed_terms"
              checked={form.agreed_terms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              required
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I hereby declare that all information provided in this application is accurate and true. I understand
              that this is a sponsored <strong>Free Driving School Program</strong> and falsification of details may
              lead to disqualification.
            </span>
          </label>
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Encrypted and secured by Supabase Cloud</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-brand-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
            </>
          ) : (
            <>
              Submit Free Application <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
