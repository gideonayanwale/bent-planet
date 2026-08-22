import Link from "next/link";
import { SparklesIcon, ShieldCheckIcon, BookOpenIcon } from "lucide-react";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-md text-slate-600 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="font-heading font-black tracking-tight text-lg text-slate-900 flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
            Bent planet
          </Link>
          <span className="text-xs text-slate-400 select-none hidden sm:inline">|</span>
          <span className="text-xs text-slate-500">
            &copy; {year} Bent planet Inc. All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <Link href="/docs" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <BookOpenIcon className="h-3.5 w-3.5" /> Docs
          </Link>
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <ShieldCheckIcon className="h-3.5 w-3.5" /> Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </Link>
          <Link
            href="/request-access"
            className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <SparklesIcon className="h-3.5 w-3.5" /> Request Church Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
