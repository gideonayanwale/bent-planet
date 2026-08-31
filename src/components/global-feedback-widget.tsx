"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquareIcon, XIcon, SendIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function GlobalFeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [category, setCategory] = useState("feature_request");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // Don't show on public conference pages (hub) to avoid distracting attendees
  if (pathname.startsWith("/c/")) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message, email }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setMessage("");
          setEmail("");
        }, 3000);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch {
      alert("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-12 w-12 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform"
          >
            <MessageSquareIcon className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 text-card-foreground">
          <div className="bg-primary p-4 flex items-center justify-between">
            <h3 className="text-primary-foreground font-bold text-sm flex items-center gap-2">
              <MessageSquareIcon className="h-4 w-4" />
              Send Feedback
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80 rounded-full"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-5">
            {isSuccess ? (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Thank you!</h4>
                  <p className="text-xs text-muted-foreground mt-1">Your feedback helps us improve.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Topic</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  >
                    <option value="feature_request">Feature Request</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="support">Support Question</option>
                    <option value="general">General Feedback</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email *</label>
                  <Input
                    type="email"
                    required
                    placeholder="For follow-up"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Message *</label>
                  <Textarea
                    required
                    placeholder="Tell us what's on your mind..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="text-xs bg-background resize-none h-24"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !message}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
                >
                  {isSubmitting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4 mr-2" />}
                  {isSubmitting ? "Sending..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
