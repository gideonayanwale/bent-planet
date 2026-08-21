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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <XIcon className="h-4 w-4" />
            </button>

            {success ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2Icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900">Thank you for your feedback!</h3>
                <p className="text-xs text-slate-600">
                  Our team reads all suggestions and inquiries to continually enhance Bent Planet.
                </p>
                <div className="pt-2">
                  <Button onClick={handleClose} size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Feedback & Support</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Have an issue, feature request, or suggestion? Let us know.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="fbName" className="text-xs">Your Name</Label>
                    <Input
                      id="fbName"
                      placeholder="e.g. Pastor David"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fbEmail" className="text-xs">Email Address *</Label>
                    <Input
                      id="fbEmail"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fbCategory" className="text-xs">Category</Label>
                    <select
                      id="fbCategory"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs"
                    >
                      <option value="feedback">General Feedback</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fbMessage" className="text-xs">Message *</Label>
                    <Textarea
                      id="fbMessage"
                      required
                      rows={4}
                      placeholder="Share your thoughts or questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="text-xs"
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
