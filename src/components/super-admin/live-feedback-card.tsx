"use client";

import { useState } from "react";
import { MessageSquareIcon, RadioIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLiveFeedback } from "@/lib/hooks/use-live-feedback";
import type { Database } from "@/types/database";

type FeedbackRow = Database["public"]["Tables"]["feedback_messages"]["Row"];

interface LiveFeedbackCardProps {
  initialMessages: FeedbackRow[];
}

export function LiveFeedbackCard({ initialMessages }: LiveFeedbackCardProps) {
  const [messages, setMessages] = useState<FeedbackRow[]>(initialMessages);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useLiveFeedback(null, (newFeedback) => {
    setMessages((prev) => [
      newFeedback,
      ...prev.filter((m) => m.id !== newFeedback.id),
    ]);
    setHasNewMessage(true);
    setTimeout(() => setHasNewMessage(false), 4000);
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <MessageSquareIcon className="h-5 w-5 text-indigo-500" />
            Recent Inquiries & Feedback
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
            <RadioIcon className={`h-3 w-3 ${hasNewMessage ? "animate-ping text-emerald-400" : "animate-pulse"}`} />
            <span>Live Feed</span>
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Submissions from the public and church user feedback overlay.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((fb, idx) => (
              <div
                key={fb.id}
                className={`p-4 rounded-2xl border border-border bg-secondary/40 space-y-1.5 transition-all duration-300 ${
                  idx === 0 && hasNewMessage
                    ? "ring-2 ring-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      {fb.user_name || fb.user_email}
                    </span>
                    <Badge variant="outline" className="text-[10px] border-border">
                      {fb.category}
                    </Badge>
                    {fb.church_id && (
                      <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-500">
                        Church Inquiry
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {fb.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-6">
            No feedback messages yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
