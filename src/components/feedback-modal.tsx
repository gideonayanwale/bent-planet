"use client";

import { useState } from "react";
import { MessageSquarePlusIcon, CheckCircle2Icon, XIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackModal({
  triggerText = "Feedback & Support",
  variant = "ghost",
  className = "",
}: {
  triggerText?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "feedback",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (success) {
      setSuccess(false);
      setForm({ name: "", email: "", category: "feedback", message: "" });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <MessageSquarePlusIcon className="h-3.5 w-3.5 mr-1.5" />
        {triggerText}
      </Button>

      {isOpen && (
        /* Full-screen backdrop — flex-col so it fills the whole screen on mobile */
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-0 sm:p-4"
          onClick={handleClose}
        >
          {/* Modal sheet — slides up on mobile, centred card on sm+ */}
          <div
            className="
              relative w-full sm:max-w-md
              bg-card text-card-foreground
              border border-border
              rounded-t-3xl sm:rounded-3xl
              shadow-2xl
              p-6 sm:p-8
              max-h-[92dvh] overflow-y-auto
              animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>

            {/* Drag handle — visible on mobile */}
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-10 h-1.5 rounded-full bg-border" />
            </div>

            {success ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                  <CheckCircle2Icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">Thank you for your feedback!</h3>
                <p className="text-xs text-muted-foreground">
                  Our team reads all suggestions and inquiries to continually enhance Bent Planet.
                </p>
                <div className="pt-2">
                  <Button onClick={handleClose} size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">Feedback & Support</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Have an issue, feature request, or suggestion? Let us know.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive dark:text-red-400">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="fbName" className="text-xs font-semibold text-foreground">Your Name</Label>
                    <Input
                      id="fbName"
                      placeholder="e.g. Pastor David"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="text-xs bg-background border-border"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fbEmail" className="text-xs font-semibold text-foreground">Email Address *</Label>
                    <Input
                      id="fbEmail"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="text-xs bg-background border-border"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fbCategory" className="text-xs font-semibold text-foreground">Category</Label>
                    <select
                      id="fbCategory"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="feedback">General Feedback</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fbMessage" className="text-xs font-semibold text-foreground">Message *</Label>
                    <Textarea
                      id="fbMessage"
                      required
                      rows={4}
                      placeholder="Share your thoughts or questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="text-xs bg-background border-border resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="sm"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 shadow-md mt-1"
                  >
                    <SendIcon className="h-3.5 w-3.5" />
                    {loading ? "Submitting..." : "Send Message"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
