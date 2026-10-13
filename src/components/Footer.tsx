import Link from "next/link";
import { ShieldCheck, Heart, Car, Sparkles, Briefcase, GraduationCap, ShoppingBag, Tv } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-white flex items-center justify-center p-1">
                <img
                  src="/logo.png"
                  alt="KobbyDrive Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-white text-lg tracking-tight">
                  Kobby<span className="text-brand-400">Drive</span> Free Driving Initiative
                </span>
                <p className="text-xs text-slate-500">Western Region Driver Training & Safety Ecosystem</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering Ghanaian youth and prospective drivers through sponsored DVLA-aligned driving education, digital simulator training, professional fleet recruitment, and partner benefits.
            </p>
            <div className="text-xs text-slate-500">
              📍 Location: Amanful West, Takoradi, Western Region, Ghana
            </div>
          </div>

          {/* Training & Education */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Training & Programs</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Free Driving School
                </Link>
              </li>
              <li>
                <Link href="/refresher-courses" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                  Refresher Courses
                </Link>
              </li>
              <li>
                <Link href="/download-form" className="hover:text-white transition-colors">
                  Download PDF Form
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Corporate & Club</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/recruitment" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  Hire Certified Drivers
                </Link>
              </li>
              <li>
                <Link href="/drivers-club" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Drivers Club (Perks)
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                  Merchandise Store
                </Link>
              </li>
              <li>
                <Link href="/simulator-ads" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  Simulator Ad Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Portal & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Admin Dashboard
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Strict Data Protection</span>
              </li>
              <li>
                <span className="text-slate-500">DVLA Compliant Curriculum</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} KobbyDrive Initiative. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by KobbyDrive Driving Simulator & Academy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
