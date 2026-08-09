"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, SparklesIcon, CheckIcon, AlertCircleIcon } from "lucide-react";

interface BroadcastEmailComposerProps {
  churchName: string;
  subscriberCount: number;
}

export function BroadcastEmailComposer({
  churchName,
  subscriberCount,
}: BroadcastEmailComposerProps) {
  const [subject, setSubject] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaText, setCtaText] = useState("");

  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAIDraft = () => {
    setIsDrafting(true);
    setTimeout(() => {
      setSubject(`Important Update from ${churchName} 🙏`);
      setBodyContent(
        `Grace and peace to you in the name of our Lord Jesus Christ!\n\nWe wanted to reach out and share an exciting update about what God is doing in our ministry. Thank you for being a valued part of the ${churchName} family.\n\nBe on the lookout for our upcoming conference sessions and live streams. We look forward to gathering with you online soon!`
      );
      setCtaText("View Conference Page");
      setIsDrafting(false);
    }, 600);
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
        <div>
          <h4 className="text-sm font-bold text-indigo-950">Broadcast Audience</h4>
          <p className="text-xs text-indigo-700 mt-0.5">
            This message will be sent to all <strong>{subscriberCount}</strong> subscriber(s) registered under {churchName}.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAIDraft}
          disabled={isDrafting}
          className="flex items-center gap-2 bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
        >
          <SparklesIcon className="w-4 h-4 text-indigo-600" />
          {isDrafting ? "Drafting..." : "Draft Announcement with AI"}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 uppercase">Email Subject Line</label>
        <Input
          required
          placeholder="e.g. Join us for a special word this weekend!"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 uppercase">Message Body</label>
        <Textarea
          required
          rows={6}
          placeholder="Write your email announcement here..."
          value={bodyContent}
          onChange={(e) => setBodyContent(e.target.value)}
          className="bg-white font-sans leading-relaxed"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase">Action Button Link (Optional)</label>
          <Input
            placeholder="https://..."
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            className="bg-white font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase">Button Label (Optional)</label>
          <Input
            placeholder="e.g. Register Now"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSending || subscriberCount === 0}
          className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 px-6"
        >
          <SendIcon className="w-4 h-4" />
          {isSending ? "Sending Broadcast..." : `Send Email to ${subscriberCount} Subscribers`}
        </Button>
      </div>
    </form>
  );
}
