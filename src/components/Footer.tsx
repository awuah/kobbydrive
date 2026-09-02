import Link from "next/link";
import { Car, Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-10 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-white flex items-center justify-center">
              <img
                src="/logo.png"
                alt="KobbyDrive Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">
                Kobby<span className="text-brand-400">Drive</span> Free Driving Initiative
              </span>
              <p className="text-xs text-slate-500">Free Driving Education & Road Safety Certification</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Application Form
            </Link>
            <Link href="/track" className="hover:text-white transition-colors">
              Check Status
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-brand-400" /> Admin
            </Link>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Built with precision for KobbyDrive © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
