"use client";

import { useState } from "react";
import {
  LayoutTemplateIcon,
  XIcon,
  CheckIcon,
  SparklesIcon,
  RadioIcon,
  BellRingIcon,
  MailIcon,
  FlameIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TemplateGalleryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: (church: string) => string;
  body: (church: string) => string;
  ctaText: string;
  ctaUrlPlaceholder: string;
  badgeColor: string;
  icon: typeof LayoutTemplateIcon;
  previewSnippet: string;
}

export const VISUAL_EMAIL_TEMPLATES: TemplateGalleryItem[] = [
  {
    id: "event-announcement",
    name: "Conference & Event Announcement",
    category: "Events",
    description: "High-impact invitation with speaker highlight, conference dates, and reserve spot call to action.",
    subject: (church) => `📢 Announcing our upcoming conference at ${church}!`,
    body: (church) =>
      `Dear beloved family,\n\nWe are thrilled to invite you to our upcoming gathering at ${church}! God has prepared a catalytic word and an extraordinary atmosphere of worship, teaching, and divine breakthrough for you.\n\nReserve your free spot online today and invite your friends and loved ones to join us livestreaming.`,
    ctaText: "Reserve Your Free Spot",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    icon: FlameIcon,
    previewSnippet: "God has prepared a catalytic word and an extraordinary atmosphere of worship...",
  },
  {
    id: "live-now-alert",
    name: "Livestream Broadcast Is LIVE Now",
    category: "Live Alerts",
    description: "Urgent broadcast alert designed for maximum click-through when your service or stream kicks off.",
    subject: (church) => `🎙️ We are LIVE right now — Join ${church}!`,
    body: (church) =>
      `The broadcast from ${church} has started! Worship is underway and the Word is about to be ministered.\n\nClick below to jump straight into the livestream now!`,
    ctaText: "Watch Live Stream Now",
    ctaUrlPlaceholder: "https://youtube.com/live/...",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-200",
    icon: RadioIcon,
    previewSnippet: "The broadcast from our ministry has started! Worship is underway...",
  },
  {
    id: "24h-reminder",
    name: "24-Hour Countdown Reminder",
    category: "Reminders",
    description: "Pre-event countdown reminder with study notes link and broadcast schedule reminder.",
    subject: (church) => `🔥 Tomorrow! Our live conference goes live — ${church}`,
    body: (church) =>
      `Greetings in Christ from ${church}!\n\nThis is a quick reminder that our special conference starts tomorrow! We encourage you to prepare your heart and tune in on time.\n\nClick the link below to access the livestream and download the conference guide.`,
    ctaText: "Access Livestream & Guide",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-200",
    icon: BellRingIcon,
    previewSnippet: "This is a quick reminder that our special conference starts tomorrow! Tune in...",
  },
  {
    id: "replay-notes",
    name: "Post-Event Replay & Free Study Notes",
    category: "Follow-up",
    description: "Follow-up email with on-demand video replay links and downloadable sermon notes / slides.",
    subject: (church) => `🙏 Thank you for joining! Watch the replay & notes — ${church}`,
    body: (church) =>
      `What a powerful encounter we had in God's presence at ${church}!\n\nIf you missed any session or want to revisit the revelations shared, the full on-demand replay and free conference notes are now available.`,
    ctaText: "Watch Replay & Download Notes",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: MailIcon,
    previewSnippet: "What a powerful encounter we had in God's presence! Access the on-demand replay...",
  },
  {
    id: "weekly-service",
    name: "Weekly Fellowship & Sunday Service",
    category: "Weekly",
    description: "Nurturing weekly communion and invitation for Sunday service and midweek Bible study.",
    subject: (church) => `✨ Join us this week for fellowship at ${church}`,
    body: (church) =>
      `Beloved in Christ,\n\nWe welcome you to worship with us this week at ${church} as we grow together in God's word and fellowship. We are believing for your continued spiritual growth and victory in every area of life.`,
    ctaText: "Join Online Service",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-200",
    icon: SparklesIcon,
    previewSnippet: "We welcome you to worship with us this week as we grow together in God's word...",
  },
];

export function EmailTemplatesGalleryModal({
  isOpen,
  onClose,
  churchName,
  onSelectTemplate,
}: {
  isOpen: boolean;
  onClose: () => void;
  churchName: string;
  onSelectTemplate: (template: TemplateGalleryItem) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Events", "Live Alerts", "Reminders", "Follow-up", "Weekly"];
  const filtered =
    selectedCategory === "All"
      ? VISUAL_EMAIL_TEMPLATES
      : VISUAL_EMAIL_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <LayoutTemplateIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Ministry Email Templates Gallery
              </h3>
              <p className="text-xs text-slate-500">
                Choose a pre-designed, high-converting ministry template and customize it before sending.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.id}
                className="group relative rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${tmpl.badgeColor}`}>
                        {tmpl.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-indigo-950">
                      {tmpl.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-sans text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 line-clamp-1">
                      Subject: {tmpl.subject(churchName)}
                    </p>
                    <p className="text-slate-500 line-clamp-2">{tmpl.previewSnippet}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    CTA: &quot;{tmpl.ctaText}&quot;
                  </span>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 shadow-xs"
                    onClick={() => {
                      onSelectTemplate(tmpl);
                      onClose();
                    }}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    Use Template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
