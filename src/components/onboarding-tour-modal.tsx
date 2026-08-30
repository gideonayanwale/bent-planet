"use client";

import { useState } from "react";
import {
  SparklesIcon,
  PaletteIcon,
  PhoneCallIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  BellRingIcon,
  UsersIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_TEMPLATES } from "@/lib/theme-config";

interface OnboardingTourModalProps {
  churchName?: string;
  initialCompleted?: boolean;
}

export function OnboardingTourModal({
  churchName = "Your Ministry",
  initialCompleted = true,
}: OnboardingTourModalProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("modern_gradient");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already completed in DB, don't show
  if (completed) return null;

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/complete-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templatePreference: selectedTemplate,
          whatsappNumber: whatsappNumber || null,
        }),
      });
      setCompleted(true);
    } catch {
      // Fallback: dismiss locally
      setCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading">Welcome to Bent Planet</h3>
                <p className="text-xs text-indigo-100">1-Minute Rapid Setup for {churchName}</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">
              Step {step} of 3
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* ── STEP 1: TEMPLATE AMBIENCE ── */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <PaletteIcon className="h-4 w-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Default Conference Theme</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Choose the default design theme and colour ambience for your conference landing pages. You can override this on any individual event.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ALL_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`relative text-left rounded-2xl p-3.5 transition-all border ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex items-center justify-center h-4 w-4 rounded-full bg-indigo-600 text-white">
                          <CheckCircle2Icon className="h-3 w-3" />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-2">
                        {tmpl.previewColors.map((color, i) => (
                          <span
                            key={i}
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{tmpl.name}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{tmpl.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: WHATSAPP RSVP COORDINATOR ── */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <PhoneCallIcon className="h-4 w-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">WhatsApp Direct RSVP</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enable high-conversion WhatsApp RSVPs. Attendees on your conference page can click a button to start a pre-filled WhatsApp conversation with your coordinator.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="tourWhatsapp" className="text-xs font-bold">
                  Coordinator WhatsApp Number (with Country Code)
                </Label>
                <Input
                  id="tourWhatsapp"
                  type="tel"
                  placeholder="e.g. +234 803 123 4567 or +1 415 555 2671"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  You can leave this blank for now and add it later in your Settings.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <p className="font-semibold">📱 How this helps your ministry:</p>
                <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                  When enabled, conference landing pages include a prominent &ldquo;Click to Chat with Coordinator&rdquo; button pre-filled with the attendee&apos;s request to join.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: WORKSPACE CHECKLIST ── */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Everything is Ready</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your Bent Planet cloud workspace is now live and equipped with all essential ministry tools:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200 dark:border-slate-700">
                  <BellRingIcon className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">Automated Email Sequences</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">7-day, 24-hour reminders, and post-conference follow-ups</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200 dark:border-slate-700">
                  <UsersIcon className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">CSV Subscriber Importer</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Import past church contacts with automatic deduplication</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200 dark:border-slate-700">
                  <FileTextIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">Study Guides & Downloads</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Offer free companion PDFs, devotionals, and ministration notes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200 dark:border-slate-700">
                  <SparklesIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">Broadcast Email Center</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Send custom announcements with 5 faith-based ministry templates</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="gap-1.5 text-xs font-semibold"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                Continue
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleFinish}
                className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md"
              >
                <CheckCircle2Icon className="h-3.5 w-3.5" />
                {isSubmitting ? "Launching..." : "Launch My Ministry Workspace"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
