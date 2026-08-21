"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SendIcon,
  SparklesIcon,
  CheckIcon,
  AlertCircleIcon,
  LayoutTemplateIcon,
} from "lucide-react";

interface BroadcastEmailComposerProps {
  churchName: string;
  subscriberCount: number;
}

interface EmailTemplate {
  name: string;
  category: string;
  subject: (church: string) => string;
  body: (church: string) => string;
  ctaText: string;
  ctaUrlPlaceholder: string;
}

const PREBUILT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    name: "New Event Announcement",
    category: "Events",
    subject: (church) => `📢 Announcing our upcoming conference at ${church}!`,
    body: (church) =>
      `Dear beloved family,\n\nWe are thrilled to invite you to our upcoming gathering at ${church}! God has prepared a catalytic word and an extraordinary atmosphere of worship, teaching, and divine breakthrough for you.\n\nReserve your free spot online today and invite your friends and loved ones to join us livestreaming.`,
    ctaText: "Reserve Your Free Spot",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
  {
    name: "24h Event Reminder",
    category: "Reminders",
    subject: (church) => `🔥 Tomorrow! Our live conference goes live — ${church}`,
    body: (church) =>
      `Greetings in Christ from ${church}!\n\nThis is a quick reminder that our special conference starts tomorrow! We encourage you to prepare your heart and tune in on time.\n\nClick the link below to access the livestream and download the conference guide.`,
    ctaText: "Access Livestream & Guide",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
  {
    name: "We Are LIVE Now!",
    category: "Live Alerts",
    subject: (church) => `🎙️ We are LIVE right now — Join ${church}!`,
    body: (church) =>
      `The broadcast from ${church} has started! Worship is underway and the Word is about to be ministered.\n\nClick below to jump straight into the livestream now!`,
    ctaText: "Watch Live Stream",
    ctaUrlPlaceholder: "https://youtube.com/watch?v=...",
  },
  {
    name: "Post-Event Replay & Study Notes",
    category: "Follow-up",
    subject: (church) => `🙏 Thank you for joining! Watch the replay & notes — ${church}`,
    body: (church) =>
      `What a powerful encounter we had in God's presence at ${church}!\n\nIf you missed any session or want to revisit the revelations shared, the full on-demand replay and free conference notes are now available.`,
    ctaText: "Watch Replay & Download Notes",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
  {
    name: "Weekly Service Invitation",
    category: "Weekly",
    subject: (church) => `✨ Join us this week for fellowship at ${church}`,
    body: (church) =>
      `Beloved in Christ,\n\nWe welcome you to worship with us this week at ${church} as we grow together in God's word and fellowship. We are believing for your continued spiritual growth and victory in every area of life.`,
    ctaText: "Join Online Service",
    ctaUrlPlaceholder: "https://bentplanet.com/c/...",
  },
];

export function BroadcastEmailComposer({
  churchName,
  subscriberCount,
}: BroadcastEmailComposerProps) {
  const [subject, setSubject] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaText, setCtaText] = useState("");

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const applyTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template.name);
    setSubject(template.subject(churchName));
    setBodyContent(template.body(churchName));
    setCtaText(template.ctaText);
    if (!ctaUrl) {
      setCtaUrl(template.ctaUrlPlaceholder);
    }
  };

  const handleAIDraft = () => {
    setIsDrafting(true);
    setTimeout(() => {
      setSubject(`Important Ministry Update & Fellowship — ${churchName} 🙏`);
      setBodyContent(
        `Grace and peace to you in the name of our Lord Jesus Christ!\n\nWe wanted to reach out and share an exciting update about what God is doing in our ministry. Thank you for being a valued part of the ${churchName} family.\n\nBe on the lookout for our upcoming conference sessions and live streams. We look forward to gathering with you online soon!`
      );
      setCtaText("View Conference Page");
      setIsDrafting(false);
    }, 500);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !bodyContent) return;

    setIsSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          bodyContent,
          ctaUrl: ctaUrl || null,
          ctaText: ctaText || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: `Broadcast email successfully queued for ${data.count} subscriber(s)!`,
        });
        setSubject("");
        setBodyContent("");
        setCtaUrl("");
        setCtaText("");
        setSelectedTemplate(null);
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Failed to dispatch broadcast email.",
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: "error",
        text: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <LayoutTemplateIcon className="h-4 w-4 text-indigo-600" />
          <span>Quick Ministry Email Templates:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PREBUILT_EMAIL_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => applyTemplate(tmpl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                selectedTemplate === tmpl.name
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        {statusMsg && (
          <div
            className={`flex items-center gap-2 p-4 text-sm rounded-xl border ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            {statusMsg.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
          <div>
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Broadcast Audience</h4>
            <p className="text-xs text-indigo-800 mt-0.5">
              This message will be dispatched to all <strong>{subscriberCount}</strong> registered subscriber(s) of {churchName}.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIDraft}
            disabled={isDrafting}
            className="flex items-center gap-1.5 bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs shrink-0"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
            {isDrafting ? "Drafting..." : "Generate AI Copy"}
          </Button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Subject Line *</label>
          <Input
            required
            placeholder="e.g. Join us for a special word this weekend!"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Body Message *</label>
          <Textarea
            required
            rows={7}
            placeholder="Write your email message here..."
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            className="bg-white font-sans text-xs leading-relaxed"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Call-to-Action Link (Optional)</label>
            <Input
              placeholder="https://bentplanet.com/c/..."
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className="bg-white font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Button Label (Optional)</label>
            <Input
              placeholder="e.g. Register Free Online"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="bg-white text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSending || subscriberCount === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 px-6 shadow-md"
          >
            <SendIcon className="w-4 h-4" />
            {isSending ? "Sending Broadcast..." : `Send Email to ${subscriberCount} Subscribers`}
          </Button>
        </div>
      </form>
    </div>
  );
}
