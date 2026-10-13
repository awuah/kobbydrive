"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Award,
  Fuel,
  Wrench,
  Sparkles,
  CheckCircle2,
  Search,
  ArrowRight,
  QrCode,
  CreditCard,
  Percent,
  Clock,
  Car,
  LifeBuoy,
  Phone,
  Gift,
  BadgePercent,
  Copy,
  Check,
} from "lucide-react";

export default function DriversClubPage() {
  const [memberQuery, setMemberQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [memberData, setMemberData] = useState<{
    name: string;
    memberId: string;
    tier: string;
    validThru: string;
    status: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleVerifyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberQuery.trim()) return;

    setSearched(true);
    // Simulating verified member look-up based on ref number or phone
    const clean = memberQuery.trim().toUpperCase();
    const isMockRef = clean.includes("KBD-") || clean.length >= 8;

    if (isMockRef) {
      setMemberData({
        name: "Verified Club Member",
        memberId: clean.startsWith("KBD-") ? `CLUB-${clean.slice(4)}` : `CLUB-${clean.slice(-6)}`,
        tier: "Gold Elite Driver",
        validThru: "12/2027",
        status: "Active & Certified",
      });
    } else {
      setMemberData({
        name: "Registered Trainee",
        memberId: `CLUB-KD${Math.floor(1000 + Math.random() * 9000)}`,
        tier: "Silver Apprentice",
        validThru: "12/2026",
        status: "Active Student",
      });
    }
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const partnerDeals = [
    {
      id: "deal-01",
      partner: "Goil & TotalEnergies Takoradi",
      title: "Fuel Savings Rebate",
      discount: "7% Off Per Litre",
      category: "Fuel",
      icon: Fuel,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      code: "KOBBY-FUEL-7",
      desc: "Instant discount on Super & Diesel at participating stations across Sekondi-Takoradi metro.",
      howToClaim: "Show your digital member pass at the fuel pump before dispensing.",
    },
    {
      id: "deal-02",
      partner: "Autocheck Hub & FastFit Mechanics",
      title: "Vehicle Servicing & Diagnostics",
      discount: "15% Off Total Bill",
      category: "Maintenance",
      icon: Wrench,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      code: "KOBBY-SERVICE-15",
      desc: "Full computer diagnostic scan, brake pads replacement, suspension check, and engine oil overhaul.",
      howToClaim: "Present voucher code upon booking maintenance service.",
    },
    {
      id: "deal-03",
      partner: "Enterprise & SIC Insurance",
      title: "Motor Insurance Policy Discount",
      discount: "10% Premium Cash-Back",
      category: "Insurance",
      icon: Shield,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      code: "KOBBY-INSURE-10",
      desc: "Special discounted premium on comprehensive and third-party commercial/private vehicle insurance.",
      howToClaim: "Enter promo code online or present member certificate to your agent.",
    },
    {
      id: "deal-04",
      partner: "Takoradi Metro Road Rescue",
      title: "24/7 Roadside Towing & Battery Jump",
      discount: "Free Emergency Rescue",
      category: "Roadside Rescue",
      icon: LifeBuoy,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      code: "KOBBY-RESCUE-METRO",
      desc: "Emergency breakdown towing, tire puncture repair, and jump-start service within 25km radius.",
      howToClaim: "Call emergency dispatch hotline: 0244-KOBBY-HELP and quote your Club ID.",
    },
    {
      id: "deal-05",
      partner: "Sparkle Auto Wash Bays",
      title: "Fleet Detailing & Exterior Wash",
      discount: "Buy 2 Get 1 Free",
      category: "Car Care",
      icon: Sparkles,
      color: "text-teal-600 bg-teal-50 border-teal-200",
      code: "KOBBY-WASH-FREE",
      desc: "High-pressure undercarriage wash, foam polish, and interior vacuuming at Amanful & Beach Road bays.",
      howToClaim: "Flash your digital pass on arrival.",
    },
    {
      id: "deal-06",
      partner: "Kumho & Maxxis Tyre Center",
      title: "Brand New Tyres & Wheel Alignment",
      discount: "12% Off New Tyres",
      category: "Tyres & Wheels",
      icon: Car,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      code: "KOBBY-TYRE-12",
      desc: "Discount on all tyre brands with complimentary laser wheel balancing and nitrogen inflation.",
      howToClaim: "Present your member pass at checkout.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Exclusive Members-Only Community
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              KobbyDrive Elite Drivers Club
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Unlock exclusive partner discounts on fuel, vehicle servicing, insurance rebates, and 24/7 roadside assistance. Designed exclusively for certified graduates and trainees of the Kobby Free Driving School.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#claim-card"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                Access Your Digital Member Pass
              </a>
              <a
                href="#exclusive-discounts"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Explore Partner Discounts
              </a>
            </div>
          </div>
        </div>

        {/* Member Benefits Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-2xl font-black text-amber-600">7% - 15%</div>
            <div className="text-xs font-bold text-slate-900">Partner Savings</div>
            <p className="text-[11px] text-slate-500">Fuel, maintenance & spares</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-2xl font-black text-brand-600">24 / 7</div>
            <div className="text-xs font-bold text-slate-900">Roadside Rescue</div>
            <p className="text-[11px] text-slate-500">Free emergency dispatch</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-2xl font-black text-purple-600">VIP</div>
            <div className="text-xs font-bold text-slate-900">Fleet Network</div>
            <p className="text-[11px] text-slate-500">Priority job placement links</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-2xl font-black text-emerald-600">100% Free</div>
            <div className="text-xs font-bold text-slate-900">Member Onboarding</div>
            <p className="text-[11px] text-slate-500">Zero annual subscription</p>
          </div>
        </div>

        {/* Digital Membership Pass Check Section */}
        <div id="claim-card" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Instant Pass Generator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verify & Reveal Your Digital Club Pass
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your official Application Reference Number (e.g. KBD-2026-XXXXX) or registered Phone Number to load your personalized digital membership card.
            </p>
          </div>

          <form onSubmit={handleVerifyMember} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                placeholder="Enter Reference (KBD-...) or Phone..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
            >
              Verify Pass
            </button>
          </form>

          {/* Holographic Digital Member Card */}
          {memberData && (
            <div className="max-w-md mx-auto transform transition-all animate-in zoom-in-95 duration-300">
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl border-2 border-amber-500/40 overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center font-black text-amber-300 text-sm">
                      KD
                    </div>
                    <div>
                      <div className="font-extrabold text-sm tracking-tight text-white">KOBBYDRIVE</div>
                      <div className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold">
                        Elite Drivers Club
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
                    {memberData.tier}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Member Identification</span>
                    <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                      {memberData.memberId}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Membership Status</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {memberData.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Valid Thru</span>
                      <span className="font-bold text-white mt-0.5 block">{memberData.validThru}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[11px] text-slate-400">
                  <span>Authorized Western Region Chapter</span>
                  <div className="flex items-center gap-1 font-mono text-amber-300">
                    <QrCode className="w-4 h-4" /> VERIFIED
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exclusive Discounts Directory */}
        <div id="exclusive-discounts" className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Member Privileges
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Active Member Deals & Partner Discounts
            </h2>
            <p className="text-sm text-slate-500">
              Present your club pass or redeem with promo codes at partner locations across Ghana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerDeals.map((deal) => {
              const Icon = deal.icon;
              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border ${deal.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white shadow-xs">
                        {deal.discount}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                        {deal.partner}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{deal.title}</h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{deal.desc}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Voucher Code:</span>
                        <span className="font-mono font-black text-slate-900">{deal.code}</span>
                      </div>
                      <button
                        onClick={() => copyDiscountCode(deal.code)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                      >
                        {copiedCode === deal.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <strong>How to Redeem:</strong> {deal.howToClaim}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
