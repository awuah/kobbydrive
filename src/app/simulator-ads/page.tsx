"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Monitor, 
  Eye, 
  TrendingUp, 
  Compass, 
  Layers, 
  Tv, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Send,
  Zap,
  BarChart3,
  Award,
  Smartphone
} from "lucide-react";

interface AdFormat {
  id: string;
  name: string;
  badge: string;
  description: string;
  resolution: string;
  dwellTime: string;
  impressions: string;
  previewType: "billboard" | "hud" | "splash";
}

const AD_FORMATS: AdFormat[] = [
  {
    id: "billboard",
    name: "3D Virtual Highway Billboards",
    badge: "Most Popular",
    description: "Placed dynamically along high-traffic virtual urban roads, roundabouts, and highways inside the simulation world.",
    resolution: "1920 x 1080 (HD Digital Billboard)",
    dwellTime: "8 - 14 seconds per drive-by",
    impressions: "35,000+ views / mo",
    previewType: "billboard"
  },
  {
    id: "hud",
    name: "Cockpit GPS / In-Dash Display",
    badge: "High Recall",
    description: "Featured directly on the simulator dashboard navigation unit during engine start, parking maneuvers, and red lights.",
    resolution: "800 x 480 (Cockpit Center Console)",
    dwellTime: "30 - 60 seconds stationary",
    impressions: "22,000+ views / mo",
    previewType: "hud"
  },
  {
    id: "splash",
    name: "Pre & Post-Session Spotlight",
    badge: "100% Share of Voice",
    description: "Full-screen high-impact spotlight video or graphic shown during student pre-flight inspection and post-session scorecards.",
    resolution: "1920 x 1080 Full HD / 15s Video",
    dwellTime: "15 seconds unskippable",
    impressions: "12,500+ completions / mo",
    previewType: "splash"
  }
];

const PACKAGES = [
  {
    name: "Highway Starter",
    price: "GH₵ 450",
    period: "per month",
    subtitle: "Ideal for local auto shops, car washes, and emerging brands in Takoradi.",
    features: [
      "2 High-Visibility Virtual Roadside Billboards",
      "Rotated across all beginner & intermediate simulation tracks",
      "Guaranteed 12,000+ student drive-by impressions",
      "Basic quarterly performance summary report",
      "Standard banner creative assistance included"
    ],
    recommended: false
  },
  {
    name: "Prime Urban Network",
    price: "GH₵ 950",
    period: "per month",
    subtitle: "Recommended for insurance firms, telcos, banks, and automotive service networks.",
    features: [
      "5 Virtual Billboards across Urban & Highway tracks",
      "Cockpit GPS In-Dash Display during stop scenarios",
      "Guaranteed 35,000+ engaged impressions",
      "Monthly detailed analytics & audience engagement metric",
      "Free 3D asset conversion & placement optimization",
      "Priority inclusion in student graduation vouchers"
    ],
    recommended: true
  },
  {
    name: "Full Simulation Takeover",
    price: "GH₵ 1,800",
    period: "per month",
    subtitle: "Exclusive category partnership for petroleum giants, vehicle distributors, & fintechs.",
    features: [
      "Exclusive Category Ownership (No direct competitors shown)",
      "10 Virtual Billboards + Pre/Post Spotlight Session Screens",
      "Custom 3D Branded Fuel Station in virtual Takoradi city map",
      "Cockpit Center Console persistent banner integration",
      "Comprehensive weekly executive report & conversion metrics",
      "Dedicated account manager & creative updates anytime"
    ],
    recommended: false
  }
];

export default function SimulatorAdsPage() {
  const [selectedFormat, setSelectedFormat] = useState<"billboard" | "hud" | "splash">("billboard");
  const [brandName, setBrandName] = useState("Enterprise Life");
  const [slogan, setSlogan] = useState("Drive Safe. We Protect Your Journey.");
  const [accentColor, setAccentColor] = useState("#2563eb");
  
  // Inquiry form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    adFormat: "Prime Urban Network",
    budgetMonthly: 950,
    targetDuration: "3 Months",
    campaignMessage: ""
  });

  const handleOpenModal = (pkgName?: string) => {
    if (pkgName) {
      setFormData(prev => ({ ...prev, adFormat: pkgName }));
    }
    setIsModalOpen(true);
    setSubmittedInquiryId(null);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/simulator-ads/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedInquiryId(data.inquiryId);
      } else {
        alert(data.error || "Failed to submit inquiry.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again or reach out on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-sm py-2 px-4 text-center font-medium">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>New Frontier in Ad-Tech: Reach 1,400+ focused learner & corporate drivers right inside our simulated vehicles.</span>
          <button 
            onClick={() => handleOpenModal()} 
            className="underline font-semibold hover:text-amber-200 ml-2"
          >
            Request Media Kit →
          </button>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/50 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Tv className="w-3.5 h-3.5" />
              In-Simulator Advertising Network
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              Advertise Inside Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                High-Fidelity Driving Simulators
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              Capture 100% undivided driver attention. Place your brand on virtual billboards, dashboard GPS screens, and simulated Sekondi-Takoradi cityscapes with zero ad blockers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleOpenModal()}
                className="px-8 py-3.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                Book Ad Space Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#simulator-preview"
                className="px-6 py-3.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2"
              >
                Try Interactive 3D Previewer
              </a>
            </div>
          </div>

          {/* Key Metrics Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center backdrop-blur">
              <div className="text-3xl lg:text-4xl font-black text-cyan-400 mb-1">1,400+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Monthly Drivers</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center backdrop-blur">
              <div className="text-3xl lg:text-4xl font-black text-blue-400 mb-1">6,200+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Simulated Cockpit Hours</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center backdrop-blur">
              <div className="text-3xl lg:text-4xl font-black text-emerald-400 mb-1">100%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Focused Attention Rate</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center backdrop-blur">
              <div className="text-3xl lg:text-4xl font-black text-purple-400 mb-1">0%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ad-Blocker Interference</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Ad Previewer */}
      <section id="simulator-preview" className="py-20 bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50">
              Live Mockup Generator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
              See Your Brand Inside the Simulator
            </h2>
            <p className="text-slate-400">
              Customize your brand assets below to preview how trainees and certified drivers experience your advertisement inside our virtual cockpit.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            {/* Customizer Controls */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Customize Preview
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Ad Format Placement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedFormat("billboard")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      selectedFormat === "billboard"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    3D Billboard
                  </button>
                  <button
                    onClick={() => setSelectedFormat("hud")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      selectedFormat === "hud"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    Cockpit HUD
                  </button>
                  <button
                    onClick={() => setSelectedFormat("splash")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      selectedFormat === "splash"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    Session Splash
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Brand Name / Company
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Tagline / Campaign Message
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Brand Theme Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: "#2563eb", name: "Blue" },
                    { color: "#16a34a", name: "Green" },
                    { color: "#dc2626", name: "Red" },
                    { color: "#d97706", name: "Gold" },
                    { color: "#9333ea", name: "Purple" }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setAccentColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        accentColor === c.color ? "scale-110 border-white ring-2 ring-cyan-400" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleOpenModal()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-md"
                >
                  Inquire For This Placement
                </button>
              </div>
            </div>

            {/* Live 3D Simulation Render Frame */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl bg-black border-2 border-slate-700 overflow-hidden shadow-2xl aspect-video flex flex-col justify-between p-4 sm:p-6">
                {/* Visualizer Background Mock (Road scene) */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 pointer-events-none" />
                
                {/* Simulated Road Horizon & Lane lines */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                  {/* Sky & horizon */}
                  <div className="h-1/2 bg-gradient-to-b from-indigo-950 to-slate-800" />
                  {/* Road */}
                  <div className="h-1/2 bg-slate-900 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 border-r-4 border-dashed border-yellow-400 opacity-60" />
                  </div>
                </div>

                {/* Top HUD status info */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-cyan-400 font-mono tracking-widest bg-slate-950/80 px-3 py-1.5 rounded-lg border border-cyan-900/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    KOBBYDRIVE SIM ENGINE v4.2 • TAKORADI METRO
                  </span>
                  <span>SPEED: 58 KM/H • GEAR: D4</span>
                </div>

                {/* Placement Center Stage Preview */}
                <div className="relative z-10 my-auto flex items-center justify-center">
                  {selectedFormat === "billboard" && (
                    <div className="w-full max-w-md bg-slate-900/90 border-4 border-slate-700 rounded-xl p-4 sm:p-6 shadow-2xl transform hover:scale-[1.02] transition-transform backdrop-blur-sm"
                         style={{ borderTopColor: accentColor, borderTopWidth: "8px" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                          HIGHWAY BILLBOARD #TDI-04
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white">
                          SPONSORED
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white" style={{ color: accentColor }}>
                        {brandName || "Your Brand Here"}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                        {slogan || "Your catchy promotional campaign message appears here."}
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Available throughout Western Region routes</span>
                        <span className="text-cyan-400 font-bold">100% Student Viewability</span>
                      </div>
                    </div>
                  )}

                  {selectedFormat === "hud" && (
                    <div className="w-full max-w-sm bg-slate-950 border-2 border-cyan-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                        <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                          <Compass className="w-3 h-3" /> GPS COCKPIT NAV
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">NEXT: 200M LEFT</span>
                      </div>
                      <div className="p-3 rounded-xl text-center" style={{ backgroundColor: `${accentColor}25`, border: `1px solid ${accentColor}60` }}>
                        <div className="text-xs font-black uppercase text-white" style={{ color: accentColor }}>
                          {brandName || "Your Brand Name"}
                        </div>
                        <div className="text-[11px] text-slate-200 mt-1 font-medium">
                          {slogan || "Drive safe with our trusted roadside network."}
                        </div>
                        <div className="mt-2 text-[9px] text-slate-400 font-mono">
                          TAP OR GLANCE TO ENGAGE
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedFormat === "splash" && (
                    <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-black border-2 border-slate-600 rounded-2xl p-6 text-center shadow-2xl">
                      <div className="inline-block px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                        Session Complete • Partner Spotlight
                      </div>
                      <h4 className="text-2xl font-black text-white" style={{ color: accentColor }}>
                        {brandName || "Your Enterprise Partner"}
                      </h4>
                      <p className="text-sm text-slate-300 mt-2 font-medium">
                        {slogan || "Official safety partner for KobbyDrive graduates."}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-xs font-bold text-white">
                        Special Offer for Certified Drivers
                      </div>
                    </div>
                  )}
                </div>

                {/* Cockpit Steering Wheel & Dashboard Frame Mock */}
                <div className="relative z-10 flex items-end justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">SIM-01 COCKPIT</span>
                    <span>Direct Eye-Line Visibility</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-semibold">
                    Simulated In-Car Experience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Inventory Formats Breakdown */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            High-Impact Advertising Formats
          </h2>
          <p className="mt-4 text-slate-400">
            Choose from three distinct placements engineered to seamlessly blend into realistic simulator training while commanding high visual engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AD_FORMATS.map((format) => (
            <div 
              key={format.id}
              className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {format.badge}
                  </span>
                  <Monitor className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{format.name}</h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">{format.description}</p>
                
                <div className="space-y-2.5 border-t border-slate-700/60 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolution / Spec:</span>
                    <span className="text-white font-medium">{format.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Dwell Time:</span>
                    <span className="text-cyan-400 font-bold">{format.dwellTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Monthly Impressions:</span>
                    <span className="text-emerald-400 font-bold">{format.impressions}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60">
                <button
                  onClick={() => {
                    setSelectedFormat(format.previewType);
                    const element = document.getElementById("simulator-preview");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  Preview This Format
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Packages */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50">
              Transparent Advertising Rates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
              Monthly Sponsorship Packages
            </h2>
            <p className="text-slate-400">
              Get direct access to new vehicle owners, fleet drivers, and high-income driving candidates across Takoradi and the Western Region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                  pkg.recommended
                    ? "bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/10 scale-105 z-10"
                    : "bg-slate-900/60 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{pkg.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 mb-6">{pkg.subtitle}</p>

                  <ul className="space-y-3 border-t border-slate-800 pt-6">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenModal(pkg.name)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      pkg.recommended
                        ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    Select {pkg.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why In-Simulator Ads Outperform Traditional Ads */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">Why Simulator Advertising Works</h2>
          <p className="mt-2 text-slate-400">The most captive, high-intent driving audience in Ghana.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Uninterrupted Dwell Time</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Drivers in our simulation sessions cannot scroll away, skip, or close your ad. They must focus on road signs, virtual intersections, and in-car instruments throughout their session.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">High-Intent Consumers</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our students are actively purchasing cars, seeking auto insurance, buying spare parts, securing fuel loyalty cards, and upgrading consumer products right as they graduate.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verifiable Impressions</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every simulation run logs exact cockpit engagement time and drive-by occurrences, giving your corporate marketing department accurate viewability metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>

            {submittedInquiryId ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Ad Space Inquiry Received!</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Thank you for your interest in KobbyDrive Simulator Ad Network. Your reference code is:
                </p>
                <div className="font-mono text-lg font-bold bg-slate-800 text-cyan-400 py-2 px-4 rounded-lg inline-block mb-6 border border-cyan-800">
                  {submittedInquiryId}
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Our advertising director will reach out via WhatsApp/Phone within 24 hours with custom 3D asset requirements and campaign scheduling.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Book Simulator Ad Space</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Fill in your company details to receive the official media kit and lock in your virtual billboard placement.
                </p>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shell Ghana, Enterprise Insurance"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kwesi Mensah"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="024 XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="marketing@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Target Package
                      </label>
                      <select
                        value={formData.adFormat}
                        onChange={(e) => setFormData({ ...formData, adFormat: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Highway Starter">Highway Starter (GH₵ 450/mo)</option>
                        <option value="Prime Urban Network">Prime Urban Network (GH₵ 950/mo)</option>
                        <option value="Full Simulation Takeover">Full Simulation Takeover (GH₵ 1,800/mo)</option>
                        <option value="Custom 3D Landmark">Custom 3D Landmark</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Campaign Duration
                      </label>
                      <select
                        value={formData.targetDuration}
                        onChange={(e) => setFormData({ ...formData, targetDuration: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="1 Month Trial">1 Month Trial</option>
                        <option value="3 Months">3 Months (5% discount)</option>
                        <option value="6 Months">6 Months (10% discount)</option>
                        <option value="12 Months">12 Months (15% discount)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Campaign Goals / Extra Requests
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us about your brand objective or specific placement requests..."
                      value={formData.campaignMessage}
                      onChange={(e) => setFormData({ ...formData, campaignMessage: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? "Sending Inquiry..." : "Submit Inquiry & Download Media Kit"}
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
