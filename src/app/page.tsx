import Link from "next/link";
import {
  SparklesIcon,
  ShieldCheckIcon,
  ZapIcon,
  UsersIcon,
  MailIcon,
  ArrowRightIcon,
  GlobeIcon,
  CheckCircle2Icon,
  PlayIcon,
  CalendarIcon,
  RadioIcon,
  HardDriveIcon,
  CpuIcon,
  LockIcon,
  ChevronRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  const features = [
    {
      icon: CpuIcon,
      badge: "Multi-Model AI",
      title: "60-Second AI Event Creator",
      description:
        "Input your theme and ministers — our resilient multi-provider AI engine (OpenAI, DeepSeek, Gemini, Claude) instantly generates Spirit-filled descriptions, time-blocked agendas, and social promotional captions.",
      color: "from-indigo-500/20 to-purple-500/20",
      borderColor: "border-indigo-500/30",
    },
    {
      icon: UsersIcon,
      badge: "Audience CRM",
      title: "Church Subscriber Ownership",
      description:
        "Every attendee who subscribes on your public conference page belongs strictly to your ministry. Search, filter, tag, and export your audience to CSV anytime with 100% data sovereignty.",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      icon: MailIcon,
      badge: "Auto Nurture",
      title: "Automated Email Sequences",
      description:
        "Broadcast live stream links, sermon notes, and devotional guides to thousands of subscribers in 1 click using pre-designed ministry email templates and Resend infrastructure.",
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
    },
    {
      icon: HardDriveIcon,
      badge: "Cloud Storage",
      title: "Super Admin Cloud CDN",
      description:
        "Offloads all high-res logos, conference banners, and devotional PDFs to external cloud storage (Cloudinary, TeraBox Gateway, S3/R2) — protecting app server memory while serving lightning-fast media.",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Super Admin Invite",
      desc: "Platform admin sends a secure one-time onboarding invitation link to your church leader.",
    },
    {
      num: "02",
      title: "Guided Church Setup",
      desc: "Complete your ministry profile, upload logo, set timezone, and link WhatsApp/YouTube channels in 3 steps.",
    },
    {
      num: "03",
      title: "AI Conference Launch",
      desc: "AI auto-generates your full landing page, live stream player, and event QR code for Sunday bulletins.",
    },
    {
      num: "04",
      title: "Automate & Nurture",
      desc: "Capture attendee leads automatically and broadcast email updates whenever you go live with something new.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Background Ambient Glow Orbs & Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] glow-orb-indigo rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] glow-orb-purple rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] glow-orb-emerald rounded-full blur-[130px] pointer-events-none" />

      {/* Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 font-heading font-bold text-white shadow-lg shadow-indigo-500/25">
              BP
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-tight text-white leading-none">
                Bent Planet
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase leading-none mt-1">
                Church SaaS Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#ai-engine" className="hover:text-white transition">
              AI Engine
            </a>
            <a href="#security" className="hover:text-white transition">
              Cloud & Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/5">
              <Link href="/super-admin" className="flex items-center gap-1.5 text-xs font-semibold">
                <LockIcon className="h-3.5 w-3.5 text-indigo-400" />
                Super Admin
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 border border-white/10">
              <Link href="/login">Church Portal</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass-pill px-4 py-1.5 text-xs font-semibold text-indigo-200 border border-indigo-500/30 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
            <SparklesIcon className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>The Premier AI Platform for Online Church Conferences</span>
            <ChevronRightIcon className="h-3.5 w-3.5 text-indigo-400" />
          </div>

          {/* High-Impact Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gradient leading-[1.1]">
            Create, Publish & Grow Your Church Conferences with <span className="text-gradient-vibrant">Spirit-Filled AI</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 leading-relaxed max-w-2xl mx-auto font-normal">
            Bent Planet equips church ministry teams with an invite-only platform to publish AI-crafted landing pages, broadcast live streams, and auto-nurture attendees through automated email sequences.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-base px-8 h-13 rounded-2xl shadow-xl shadow-indigo-600/40 border border-white/20 gap-2">
              <Link href="/login">
                Access Church Dashboard
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass-pill text-white hover:bg-white/10 font-semibold text-base px-8 h-13 rounded-2xl border-white/20 gap-2">
              <Link href="/super-admin">
                <ShieldCheckIcon className="h-5 w-5 text-indigo-400" />
                Super Admin Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Live Interactive Glass Showcase Mockup */}
        <div className="mt-16 sm:mt-24 max-w-5xl mx-auto">
          <div className="relative rounded-3xl glass-card p-3 sm:p-4 border border-white/15 shadow-2xl shadow-indigo-950/80 glow-indigo">
            {/* Window Top Controls */}
            <div className="flex items-center justify-between pb-3 px-3 border-b border-white/10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-[11px] text-slate-400 hidden sm:inline">bentplanet.com/c/grace-fellowship/open-heavens-2025</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
                <RadioIcon className="h-3.5 w-3.5 animate-pulse" /> LIVE STREAM READY
              </div>
            </div>

            {/* Inner Live Page Preview */}
            <div className="rounded-2xl bg-slate-900/90 p-6 sm:p-8 space-y-6 mt-3 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                      Revival & Healing Encounter
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    Open Heavens & Miracles Gathering 2025
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Hosted by Grace Fellowship Ministry · Speaker: Pastor David John
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                    <PlayIcon className="h-5 w-5 fill-indigo-300" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Event Time:</div>
                    <div className="text-xs font-mono font-bold text-white">Friday, 18:00 EST</div>
                  </div>
                </div>
              </div>

              {/* Sample AI Agenda Preview */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl glass-card p-4 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">18:00 - 19:00</span>
                  <div className="text-xs font-bold text-white">Worship & Intercession</div>
                  <div className="text-[11px] text-slate-400">Atmosphere for signs & wonders</div>
                </div>
                <div className="rounded-xl glass-card p-4 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold">19:00 - 20:30</span>
                  <div className="text-xs font-bold text-white">Prophetic Ministration</div>
                  <div className="text-[11px] text-slate-400">Word of Knowledge & Prayer</div>
                </div>
                <div className="rounded-xl glass-card p-4 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">20:30 - 21:00</span>
                  <div className="text-xs font-bold text-white">Altar Call & Replay</div>
                  <div className="text-[11px] text-slate-400">Devotional PDF delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section id="features" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Engineered for Ministry Excellence</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-gradient">
            Everything Your Church Needs to Scale Online Impact
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A complete suite of tools designed specifically for church administrators and digital evangelism.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`glass-card glass-card-hover rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden border ${f.borderColor}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} border border-white/10 text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-white/10">
                    {f.badge}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Simple & Seamless Journey</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-gradient">
            How Bent Planet Operates
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From super admin invitation to automated lead nurturing in 4 steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} className="glass-card rounded-3xl p-6 space-y-4 relative">
              <div className="font-mono text-3xl font-extrabold text-gradient-vibrant">{s.num}</div>
              <h4 className="font-heading text-base font-bold text-white">{s.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI & Security Section */}
      <section id="ai-engine" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl glass-card p-8 sm:p-12 border border-white/15 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full glass-pill px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <ZapIcon className="h-3.5 w-3.5 text-emerald-400" /> Multi-API Resilient Engine
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Never Settle for Single Provider Downtime
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bent Planet's AI Engine coordinates multiple LLM providers in sequence: OpenAI (gpt-4o) → DeepSeek → Google Gemini → Anthropic Claude → Guaranteed Prebuilt Faith Variant Engine. Your church will never experience generation failures.
            </p>
            <div className="space-y-3 pt-2">
              {["100% Generation Uptime Guarantee", "Zero App Server Memory Overload via Cloud Storage CDN", "Strict Super Admin Key Security Lock"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/90 p-6 border border-white/10 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-3">
              <span>PROPRIETARY AI SEQUENCE</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-slate-300">
                <span>1. OpenAI (gpt-4o)</span>
                <span className="text-emerald-400 font-bold">PRIMARY</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-slate-300">
                <span>2. DeepSeek API</span>
                <span className="text-indigo-400">FALLBACK 1</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-slate-300">
                <span>3. Google Gemini 1.5</span>
                <span className="text-purple-400">FALLBACK 2</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 text-emerald-200 border border-emerald-500/30">
                <span>4. Prebuilt Faith Engine</span>
                <span className="text-emerald-300 font-bold">ZERO-FAIL GUARANTEE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-6 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl glass-card p-10 sm:p-16 border border-white/20 bg-gradient-to-b from-indigo-900/40 to-slate-950 space-y-6 shadow-2xl glow-indigo">
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Empower Your Church Online?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Log in to your church dashboard or enter your invitation token to activate your Bent Planet workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 font-bold text-base px-8 h-13 rounded-2xl shadow-xl">
              <Link href="/login">Church Login Portal</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass-pill text-white hover:bg-white/10 font-semibold text-base px-8 h-13 rounded-2xl border-white/20">
              <Link href="/super-admin">Super Admin Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Glassmorphic Footer */}
      <footer className="py-8 px-6 sm:px-8 border-t border-white/10 glass-nav text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="font-medium text-slate-300">Bent Planet Platform — All Systems Operational</span>
          </div>
          <div>© {new Date().getFullYear()} Bent Planet Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
