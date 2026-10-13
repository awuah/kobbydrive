"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  Star,
  Car,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  FileCheck2,
  X,
  BadgeCheck,
} from "lucide-react";
import { SAMPLE_DRIVERS, DriverProfile } from "@/lib/recruitment";

export default function DriverRecruitmentPage() {
  const [drivers] = useState<DriverProfile[]>(SAMPLE_DRIVERS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);

  // Placement Form State
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [roleCategory, setRoleCategory] = useState("Corporate Executive");
  const [packageTier, setPackageTier] = useState("Verified Executive (GH₵300)");
  const [salaryRangeGHS, setSalaryRangeGHS] = useState("GH₵1,800 - GH₵2,500");
  const [driverCount, setDriverCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const filteredDrivers = drivers.filter((drv) => {
    if (selectedCategory !== "all" && drv.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        drv.name.toLowerCase().includes(q) ||
        drv.refCode.toLowerCase().includes(q) ||
        drv.category.toLowerCase().includes(q) ||
        drv.specialties.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleHireClick = (driver?: DriverProfile) => {
    setSelectedDriver(driver || null);
    if (driver) {
      setRoleCategory(driver.category);
    }
    setSubmittedRef(null);
    setIsModalOpen(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactPerson,
          phone,
          email,
          roleCategory,
          packageTier,
          salaryRangeGHS,
          driverCount,
          notes: selectedDriver
            ? `Requested candidate: ${selectedDriver.name} (${selectedDriver.refCode}). ${notes}`
            : notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedRef(data.requestRef);
      } else {
        alert(data.error || "Failed to submit recruitment request.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold tracking-wide">
              <Briefcase className="w-3.5 h-3.5 text-brand-400" />
              Corporate Driver Recruitment Service
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Source Certified, Vetted Professional Drivers for Your Business
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Connect directly with high-performing graduates from the KobbyDrive Free Driving School. Tested on high-tech simulators, road-vetted by certified DVLA instructors, and background-checked for private and commercial fleet roles.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => handleHireClick()}
                className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-950" />
                Request Driver Placement
              </button>
              <a
                href="#pricing-tiers"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                View Placement Fee Structure
              </a>
            </div>
          </div>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Background Checked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every candidate undergoes biometric ID verification, clean-driving record audit, and residential validation.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Simulator Tested</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trainees complete rigorous hazard perception and emergency evasive braking evaluations in our 3D simulators.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Tailored Categories</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              From executive corporate chauffeurs to inter-city haulage, heavy equipment operators, and family drivers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Replacement Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All placements come with a 30-day performance trial and free replacement guarantee if requirements are not met.
            </p>
          </div>
        </div>

        {/* Candidate Directory Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Verified Talent Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Available Certified Drivers
              </h2>
              <p className="text-sm text-slate-500">
                Browse pre-screened graduates ready for corporate or private placement
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Drivers" },
                { id: "Corporate Executive", label: "Corporate Executive" },
                { id: "Private Chauffeur", label: "Private Chauffeur" },
                { id: "Commercial Transport", label: "Commercial Fleet" },
                { id: "Heavy Equipment & Haulage", label: "Heavy Equipment" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver by name, code, skill, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          {/* Driver Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 flex items-center justify-center font-black text-brand-800 text-sm">
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                          {driver.name}
                          <BadgeCheck className="w-4 h-4 text-brand-600 shrink-0" />
                        </div>
                        <span className="font-mono text-xs text-slate-400">{driver.refCode}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {driver.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Role Specialization</span>
                      <span className="font-bold text-slate-800">{driver.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">DVLA License</span>
                      <span className="font-bold text-slate-800">{driver.licenseClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Experience</span>
                      <span className="font-bold text-slate-800">{driver.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Simulator Score</span>
                      <span className="font-bold text-brand-700">{driver.simulatorScore}/100</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1.5">Core Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {driver.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{driver.rating} Rating</span>
                  </div>

                  <button
                    onClick={() => handleHireClick(driver)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    Select Candidate <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Fee Structure Section */}
        <div id="pricing-tiers" className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Clear & Transparent Placement Fees
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Private Sector Placement Packages
            </h2>
            <p className="text-sm text-slate-500">
              One-time sourcing and vetting fee per driver. Includes background check file, simulator evaluation log, and 30-day replacement warranty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Tier</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">GH₵ 150</span>
                  <span className="text-xs text-slate-500">/ driver</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ideal for personal drivers, private car owners, and family transport.
                </p>

                <ul className="text-xs space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Verified Ghana Card & License
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Driver Training Dossier
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 14-Day Free Replacement
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setPackageTier("Standard Placement (GH₵150)");
                  handleHireClick();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                Choose Standard
              </button>
            </div>

            {/* Tier 2 (Popular) */}
            <div className="p-6 rounded-2xl border-2 border-brand-500 bg-brand-50/20 space-y-5 relative shadow-md flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Verified Executive</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">GH₵ 300</span>
                  <span className="text-xs text-slate-500">/ driver</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Designed for corporate executive transport, expatriate chauffeurs, and luxury fleets.
                </p>

                <ul className="text-xs space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> High-Scoring Simulator Evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> Executive Protocol & Etiquette Vetted
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> 30-Day Free Replacement Guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> Priority 24h Candidate Shortlist
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setPackageTier("Verified Executive (GH₵300)");
                  handleHireClick();
                }}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Choose Executive
              </button>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Corporate Fleet</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">GH₵ 600</span>
                  <span className="text-xs text-slate-500">/ up to 3 drivers</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tailored for logistics operators, mining/harbour fleets, and haulage transport firms.
                </p>

                <ul className="text-xs space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Up to 3 Drivers Placed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Heavy Equipment & HGV Specialist
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 60-Day Replacement Coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated Account Coordinator
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setPackageTier("Corporate Fleet (GH₵600)");
                  handleHireClick();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                Choose Corporate Fleet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Placement Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="h-2 bg-gradient-to-r from-brand-500 to-indigo-600" />

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {submittedRef ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Placement Request Received!</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Your request has been logged. Our placement coordinator will contact you directly within 24 hours to coordinate interviews and candidate dossiers.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 font-mono text-lg font-bold text-brand-700">
                    {submittedRef}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedDriver ? `Request Placement: ${selectedDriver.name}` : "Driver Placement Request Form"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submit your hiring requirements and our recruitment desk will provide candidate profiles.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Employer Name *</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Logistics Ltd"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name *</label>
                        <input
                          type="text"
                          required
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          placeholder="e.g. Mr. Charles Quaye"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0244 123 456"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="recruitment@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Role Category</label>
                        <select
                          value={roleCategory}
                          onChange={(e) => setRoleCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-brand-500"
                        >
                          <option value="Corporate Executive">Corporate Executive Chauffeur</option>
                          <option value="Private Chauffeur">Private Family Chauffeur</option>
                          <option value="Commercial Transport">Commercial Fleet / Bus / Taxi</option>
                          <option value="Heavy Equipment & Haulage">Heavy Equipment & Haulage</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Placement Tier</label>
                        <select
                          value={packageTier}
                          onChange={(e) => setPackageTier(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-brand-500"
                        >
                          <option value="Standard Placement (GH₵150)">Standard Placement (GH₵150)</option>
                          <option value="Verified Executive (GH₵300)">Verified Executive (GH₵300)</option>
                          <option value="Corporate Fleet (GH₵600)">Corporate Fleet (GH₵600)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Requirements or Location Notes</label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention any specific working hours, transmission preference (manual/automatic), or vehicle type..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Placement Request
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
