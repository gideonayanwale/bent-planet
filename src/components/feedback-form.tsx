"use client";

import { useState } from "react";
import { CheckCircle2Icon, SendIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function FeedbackForm({ onSuccess, className = "" }: FeedbackFormProps) {
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
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 space-y-4 animate-in fade-in duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
          <CheckCircle2Icon className="h-8 w-8" />
        </div>
        <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-slate-100">
          Thank you for your feedback!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Our team reads all suggestions and inquiries to continually enhance Bent Planet. We appreciate your contribution!
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive dark:text-red-400 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fbName" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Your Name
          </Label>
          <Input
            id="fbName"
            placeholder="e.g. Pastor David"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fbEmail" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Email Address *
          </Label>
          <Input
            id="fbEmail"
            type="email"
            required
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fbCategory" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Category
          </Label>
          <select
            id="fbCategory"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="flex h-9 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-indigo-500 transition-colors"
          >
            <option value="feedback">General Feedback</option>
            <option value="feature_request">Feature Request</option>
            <option value="support">Technical Support</option>
            <option value="other">Other Inquiry</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fbMessage" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Message *
          </Label>
          <Textarea
            id="fbMessage"
            required
            rows={5}
            placeholder="Share your thoughts, suggestions, or technical support requests..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 resize-none leading-relaxed"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 shadow-md mt-1 h-10"
        >
          {loading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Submitting Message...
            </>
          ) : (
            <>
              <SendIcon className="h-3.5 w-3.5" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
