import type { Metadata } from "next";
import Link from "next/link";
import {
  SparklesIcon,
  UsersIcon,
  MailIcon,
  CheckCircle2Icon,
  HardDriveIcon,
  CpuIcon,
  BookOpenIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { HomepageClient } from "@/components/home/homepage-client";

export const metadata: Metadata = {
  title: "OIKODARA — Building the Church. Connecting the People.",
  description:
    "Bring church administration, fellowship, discipleship, events and communication into one connected workspace. Help your ministry organise its work and keep people meaningfully engaged beyond Sunday.",
};

const features = [
  {
    icon: CpuIcon,
    badge: "Event Creation",
    title: "AI-Assisted Event Setup",
    description:
      "Start with your event theme and ministry details, then use AI-assisted tools to shape event descriptions, programmes and promotional copy.",
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
  },
  {
    icon: UsersIcon,
    badge: "Audience CRM",
    title: "Church Subscriber Ownership",
    description:
      "Every attendee who subscribes on your public conference page belongs strictly to your ministry. Search, filter, tag, import from CSV with deduplication, and export your audience anytime with church-owned audience records.",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    icon: MailIcon,
    badge: "Auto Nurture",
    title: "Automated Email Sequences",
    description:
      "Share event announcements, livestream information and follow-up resources with registered attendees through ministry email workflows.",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
  },
  {
    icon: HardDriveIcon,
    badge: "Cloud Storage",
    title: "Media & Resources",
    description:
      "Keep church identity assets and event resources organised with cloud-backed media storage for dependable delivery.",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
];

const steps = [
  {
    num: "01",
    title: "Church Workspace Access",
    desc: "Your church receives an invitation or submits an access request to begin its own workspace.",
  },
  {
    num: "02",
    title: "Guided Church Setup",
    desc: "Complete your ministry profile, upload logo & cover banner, set timezone, and link WhatsApp/social channels.",
  },
  {
    num: "03",
    title: "Publish Your Event",
    desc: "Create an event page, add programme details and share the registration link with your community.",
  },
  {
    num: "04",
    title: "Communicate & Follow Up",
    desc: "Keep attendee details organised and send relevant event updates and follow-up communications.",
  },
];

export default function HomePage() {
  return (
    <HomepageClient>
      {/* Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-50 glass-nav">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo iconSize={36} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Platform Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <Link href="/templates" className="hover:text-foreground transition-colors flex items-center gap-1 font-semibold text-indigo-500 dark:text-indigo-400">
              <SparklesIcon className="h-3.5 w-3.5" />
              Templates & Wireframes
            </Link>
            <Link href="/docs" className="hover:text-foreground transition-colors flex items-center gap-1">
              <BookOpenIcon className="h-3.5 w-3.5" />
              Docs
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs h-9 font-semibold">
              <Link href="/request-access">Request Access</Link>
            </Button>
            <Button asChild size="sm" className="btn-gradient text-xs font-semibold shadow-md">
              <Link href="/login">Church Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 sm:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-semibold text-primary mb-8 glow-indigo border border-indigo-500/20">
          <SparklesIcon className="w-4 h-4 text-amber-400" />
          <span>A connected digital home for growing churches</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Building stronger church communities through{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Connected Digital Ministry
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Bring church administration, fellowship, discipleship, events and communication into one connected workspace. Help your ministry organise its work and keep people meaningfully engaged beyond Sunday.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto btn-gradient text-white font-bold text-sm px-8 h-12 rounded-2xl shadow-xl hover:opacity-90 transition">
            <Link href="/request-access">Request Church Workspace</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass-pill text-foreground hover:bg-accent/20 font-semibold text-sm px-8 h-12 rounded-2xl border-indigo-500/30 shadow-xs">
            <Link href="/templates">
              <SparklesIcon className="mr-2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              Templates & Wireframes
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass-pill text-foreground hover:bg-accent/20 font-semibold text-sm px-8 h-12 rounded-2xl">
            <Link href="/docs">
              <BookOpenIcon className="mr-2 h-4 w-4 text-indigo-500" />
              Docs
            </Link>
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mt-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative rounded-3xl glass-card p-6 sm:p-8 hover:-translate-y-1.5 transition-all duration-300 border border-border/50 hover:border-indigo-500/40"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 border ${f.borderColor}`}>
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">{f.badge}</span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-1 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightweight interactive sample preview */}
      <section id="product-preview" className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-8 rounded-3xl border border-border bg-card/80 p-5 shadow-lg sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="space-y-4"><span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Explore the workspace</span><h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">See how your ministry connects in one place.</h2><p className="text-sm leading-6 text-muted-foreground">Explore a sample church workspace with conference management, audience records, communications and platform tools. No account is required to view the demo.</p><Button asChild className="w-full sm:w-auto"><Link href="/demo">Explore the interactive demo</Link></Button></div>
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-inner"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs font-semibold text-foreground">OIKODARA workspace</span></div><span className="text-[10px] text-muted-foreground">Sample data</span></div><div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">{[{label:"Conferences",value:"12"},{label:"Subscribers",value:"846"},{label:"Messages sent",value:"2.4k"}].map((item) => <div key={item.label} className="rounded-xl border border-border bg-card p-3"><p className="text-[10px] text-muted-foreground">{item.label}</p><p className="mt-1 text-xl font-bold text-foreground">{item.value}</p></div>)}</div><div className="space-y-2 px-4 pb-4"><div className="rounded-xl border border-border bg-card p-3"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-foreground">Sunday Worship Gathering</span><span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300">Published</span></div><p className="mt-1 text-[10px] text-muted-foreground">Event page · Registration · Follow-up</p></div><div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-secondary/70 p-3 text-[10px] text-muted-foreground">Audience management</div><div className="rounded-xl bg-secondary/70 p-3 text-[10px] text-muted-foreground">Church communications</div></div></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 p-8 text-center shadow-2xl sm:p-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">The meaning behind the name</span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-[0.12em] text-white sm:text-4xl">OIKODARA</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Inspired by the New Testament word <em>oikodomē</em> — building up, strengthening and edifying the Church. OIKODARA reflects our purpose: to help churches build stronger communities and keep their people connected.
          </p>
          <p className="mt-6 text-sm font-semibold tracking-wide text-indigo-200">Building the Church. Connecting the People.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-3.5 py-1.5 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground">
            How OIKODARA supports your ministry
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            From workspace invitation to event publishing, attendee management and follow-up communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="relative rounded-3xl glass-card p-6 sm:p-8 border border-border/50 space-y-4">
              <span className="font-mono text-3xl font-extrabold text-indigo-500/40">{s.num}</span>
              <h3 className="font-heading text-lg font-bold text-foreground">{s.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Provider Architecture Callout */}
      <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl glass-card p-8 sm:p-12 border border-border/50 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Designed for connected ministry
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              A connected foundation for ministry
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              OIKODARA brings practical ministry workflows together in one place, helping teams plan events, communicate clearly and maintain consistent connections with their members.
            </p>
            <div className="space-y-3 pt-2">
              {["Designed for dependable ministry workflows", "Cloud-backed storage for church media assets", "Administrative controls for platform operations"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/90 p-6 border border-white/10 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-3">
              <span>AI CONTENT GENERATION WORKFLOW</span>
              <span className="text-emerald-400">CONFIGURABLE</span>
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
                <span className="text-emerald-300 font-bold">FALLBACK WORKFLOW</span>
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
            Give your ministry a more organised digital home. Request a church workspace to explore OIKODARA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-indigo-500 text-white hover:bg-indigo-400 font-bold text-base px-8 h-13 rounded-2xl shadow-xl">
              <Link href="/request-access">Request Church Access</Link>
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 h-13 rounded-2xl shadow-xl">
              <Link href="/login">Church Login Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Standardized Glassmorphic Footer */}
      <footer className="py-10 px-6 sm:px-8 border-t border-border glass-nav text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-85 transition">
              <BrandLogo iconSize={32} />
            </Link>
            <span className="text-muted-foreground/60">|</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span className="font-medium text-foreground/80">A connected workspace for ministry teams</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <Link href="/templates" className="hover:text-foreground transition font-medium text-indigo-500 dark:text-indigo-400">
              Templates & Wireframes
            </Link>
            <Link href="/docs" className="hover:text-foreground transition">
              Documentation
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link href="/feedback" className="hover:text-foreground transition">
              Feedback & Support
            </Link>
          </div>

          <div>
            <Link href="/" className="hover:text-primary transition font-medium">
              &copy; OIKODARA {new Date().getFullYear()}
            </Link>
          </div>
        </div>
      </footer>
    </HomepageClient>
  );
}
