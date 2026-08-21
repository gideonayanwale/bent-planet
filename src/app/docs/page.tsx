import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  SparklesIcon,
  CalendarIcon,
  UsersIcon,
  MailIcon,
  Share2Icon,
  ArrowRightIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto max-w-5xl h-16 flex items-center justify-between px-4">
          <Link href="/">
            <BrandLogo iconSize={36} />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-600">
              Home
            </Link>
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              <Link href="/login">Dashboard Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-12 space-y-12 flex-1">
        <div className="space-y-3">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-3 py-1 font-semibold">
            Knowledge Base & Guides
          </Badge>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            How to Use Bent Planet
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Everything your church needs to know about setting up your workspace, generating AI-powered conference landing pages, and nurturing your online audience.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Guide 1: Setup */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              1. Workspace Onboarding & Branding
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When invited by the Super Admin or approved via Access Request, follow your private onboarding link to set your admin password, upload your church logo & cover banner, and connect your WhatsApp group and social links.
            </p>
          </div>

          {/* Guide 2: Event Creation */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              2. Creating & AI Generating Conferences
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Navigate to <strong>Conferences &gt; New</strong>. Provide a short caption, event dates, speaker name, and flyer. Our multi-provider AI engine automatically generates full Spirit-filled descriptions, speaker bios, and social copy.
            </p>
          </div>

          {/* Guide 3: Promotion */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Share2Icon className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              3. Promotion & WhatsApp Click-to-Chat
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use your Promote tab to copy platform-optimized UTM links for Instagram, WhatsApp broadcasts, and Facebook. Attendees can RSVP with one click or start a WhatsApp chat directly with your event coordinator.
            </p>
          </div>

          {/* Guide 4: Audience & Email */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <MailIcon className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              4. Subscribers & Email Campaigns
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Import existing church rosters via CSV with automatic deduplication. Send broadcast announcements using pre-built Christian ministry templates (24h reminders, Live Now alerts, and post-conference notes).
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Bent Planet Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
