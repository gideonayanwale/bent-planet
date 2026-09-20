"use client";

import { useState } from "react";
import {
  MessageSquareIcon,
  RadioIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Maximize2Icon,
  XIcon,
  CopyIcon,
  CheckIcon,
  FilterIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLiveFeedback } from "@/lib/hooks/use-live-feedback";
import type { Database } from "@/types/database";

type FeedbackRow = Database["public"]["Tables"]["feedback_messages"]["Row"];

interface LiveFeedbackCardProps {
  initialMessages: FeedbackRow[];
}

const LENGTH_THRESHOLD = 110;

export function LiveFeedbackCard({ initialMessages }: LiveFeedbackCardProps) {
  const [messages, setMessages] = useState<FeedbackRow[]>(initialMessages);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [pinnedExpandedIds, setPinnedExpandedIds] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useLiveFeedback(null, (newFeedback) => {
    setMessages((prev) => [
      newFeedback,
      ...prev.filter((m) => m.id !== newFeedback.id),
    ]);
    setHasNewMessage(true);
    setTimeout(() => setHasNewMessage(false), 4000);
  });

  const togglePinExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPinnedExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredMessages = messages.filter((fb) => {
    if (activeCategory === "all") return true;
    return fb.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <MessageSquareIcon className="h-5 w-5 text-indigo-500" />
              Recent Inquiries & Feedback
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                <RadioIcon className={`h-3 w-3 ${hasNewMessage ? "animate-ping text-emerald-400" : "animate-pulse"}`} />
                <span>Live Feed</span>
              </div>
            </div>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Submissions from the public and church user feedback overlay. Expand any message to view full context.
          </CardDescription>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <FilterIcon className="h-3 w-3" /> Filter:
            </span>
            {["all", "feedback", "feature_request", "support", "other"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60"
                }`}
              >
                {cat === "all"
                  ? "All"
                  : cat === "feature_request"
                  ? "Features"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {filteredMessages.length > 0 ? (
            <div className="space-y-3">
              {filteredMessages.map((fb, idx) => {
                const isLong = fb.message.length > LENGTH_THRESHOLD;
                const isPinned = pinnedExpandedIds.has(fb.id);
                const isHovered = hoveredId === fb.id;
                const isExpanded = !isLong || isPinned || isHovered;

                return (
                  <div
                    key={fb.id}
                    onMouseEnter={() => setHoveredId(fb.id)}
                    onMouseLeave={() => setHoveredId((prev) => (prev === fb.id ? null : prev))}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                      idx === 0 && hasNewMessage
                        ? "ring-2 ring-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30"
                        : "border-border bg-secondary/40 hover:bg-secondary/70 hover:border-indigo-500/30 hover:shadow-sm"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground">
                          {fb.user_name || fb.user_email}
                        </span>

                        <Badge variant="outline" className="text-[10px] border-border py-0 h-4.5">
                          {fb.category}
                        </Badge>

                        {fb.church_id && (
                          <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-500 py-0 h-4.5 font-semibold">
                            Church Inquiry
                          </Badge>
                        )}

                        {/* Quick email copy button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyEmail(fb.user_email, e)}
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded-md hover:bg-background/80"
                          title="Copy submitter email"
                        >
                          {copiedEmail === fb.user_email ? (
                            <>
                              <CheckIcon className="h-3 w-3 text-emerald-500" />
                              <span className="text-emerald-500 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <CopyIcon className="h-2.5 w-2.5 opacity-70" />
                              <span className="text-[10px] opacity-75">{fb.user_email}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="text-[11px]">
                          {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ""}
                        </span>

                        {/* Open full modal detail view */}
                        <button
                          type="button"
                          onClick={() => setSelectedFeedback(fb)}
                          className="p-1 rounded-md text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                          title="View complete feedback details in modal"
                          aria-label="View complete feedback details in modal"
                        >
                          <Maximize2Icon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Message Body with Hover/Click Expand */}
                    <div className="relative">
                      <p
                        className={`text-xs text-muted-foreground leading-relaxed transition-all duration-300 whitespace-pre-wrap ${
                          isExpanded
                            ? "max-h-[600px] overflow-visible"
                            : "line-clamp-2 max-h-10 overflow-hidden"
                        }`}
                      >
                        {fb.message}
                      </p>

                      {/* Gentle fade-out overlay when clamped */}
                      {!isExpanded && (
                        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-secondary/80 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* Expand/Collapse Interactive Bar */}
                    {isLong && (
                      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => togglePinExpand(fb.id, e)}
                          className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                          {isPinned ? (
                            <>
                              <ChevronUpIcon className="h-3.5 w-3.5" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="h-3.5 w-3.5" />
                              {isHovered ? "Pinned open" : "Expand full message"}
                            </>
                          )}
                        </button>

                        <span className="text-[10px] text-muted-foreground italic">
                          {isPinned ? "Pinned open" : "Hover to expand preview"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <MessageSquareIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No feedback messages found under &quot;{activeCategory}&quot;.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Feedback Detail Modal */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedFeedback(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {selectedFeedback.user_name || "Anonymous Submitter"}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedFeedback.category}
                  </Badge>
                  {selectedFeedback.church_id && (
                    <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-500">
                      Church Inquiry
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{selectedFeedback.user_email}</span>
                  <span>•</span>
                  <span>
                    {selectedFeedback.created_at
                      ? new Date(selectedFeedback.created_at).toLocaleString()
                      : ""}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFeedback(null)}
                className="h-8 w-8 rounded-full"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Full Message
              </span>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs leading-relaxed text-foreground whitespace-pre-wrap select-text font-normal">
                {selectedFeedback.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleCopyEmail(selectedFeedback.user_email, e)}
                className="text-xs gap-1.5 h-8.5"
              >
                {copiedEmail === selectedFeedback.user_email ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                    Email Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5" />
                    Copy Submitter Email
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedFeedback(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8.5 px-4 font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
