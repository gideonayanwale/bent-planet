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
  Loader2Icon,
} from "lucide-react";
import {
  EmailTemplatesGalleryModal,
  VISUAL_EMAIL_TEMPLATES,
  TemplateGalleryItem,
} from "@/components/email-templates-gallery-modal";

interface BroadcastEmailComposerProps {
  churchName: string;
  subscriberCount: number;
  isPremium?: boolean;
}

export function BroadcastEmailComposer({
  churchName,
  subscriberCount,
  isPremium = false,
}: BroadcastEmailComposerProps) {
  const [subject, setSubject] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaText, setCtaText] = useState("");

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const applyTemplate = (template: TemplateGalleryItem) => {
    setSelectedTemplate(template.name);
    setSubject(template.subject(churchName));
    setBodyContent(template.body(churchName));
    setCtaText(template.ctaText);
    if (!ctaUrl) {
      setCtaUrl(template.ctaUrlPlaceholder);
    }
  };

  const handleAIDraft = async () => {
    setIsDrafting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: subject || "Important Ministry Update & Fellowship",
          templateType: selectedTemplate || "General Announcement",
          keyPoints: bodyContent || "",
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to generate AI draft.");
      }

      if (json.data) {
        setSubject(json.data.subject);
        setBodyContent(json.data.bodyContent);
        if (json.data.ctaText) setCtaText(json.data.ctaText);
        setStatusMsg({
          type: "success",
          text: `AI Copy drafted using ${json.data.providerUsed || "Collaborative AI Engine"}${
            json.rateLimit?.remaining !== undefined
              ? ` (${json.rateLimit.remaining} hourly generation(s) remaining)`
              : ""
          }`,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: "error",
        text: error.message || "Failed to generate AI email copy.",
      });
    } finally {
      setIsDrafting(false);
    }
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
      {/* Template Selection Pills and Gallery Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <LayoutTemplateIcon className="h-4 w-4 text-indigo-600" />
            <span>Ministry Email Templates:</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 hover:bg-indigo-50"
            onClick={() => setShowGalleryModal(true)}
          >
            Browse Full Gallery ↗
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {VISUAL_EMAIL_TEMPLATES.map((tmpl) => (
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

      <EmailTemplatesGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        churchName={churchName}
        onSelectTemplate={applyTemplate}
      />

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
            className="flex items-center gap-1.5 bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs shrink-0 font-semibold"
          >
            {isDrafting ? (
              <>
                <Loader2Icon className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                Drafting Copy...
              </>
            ) : (
              <>
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
                Generate AI Copy
              </>
            )}
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
