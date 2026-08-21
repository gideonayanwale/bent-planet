"use client";

import { useState } from "react";
import {
  SparklesIcon,
  CheckCircle2Icon,
  XIcon,
  Building2Icon,
  ArrowRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RequestAccessModal({
  triggerText = "Request Church Access",
  variant = "default",
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

  const [formData, setFormData] = useState({
    churchName: "",
    adminName: "",
    email: "",
    phone: "",
    website: "",
    denomination: "Pentecostal",
    country: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (success) {
      setSuccess(false);
      setFormData({
        churchName: "",
        adminName: "",
        email: "",
        phone: "",
        website: "",
        denomination: "Pentecostal",
        country: "",
        notes: "",
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {triggerText}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <XIcon className="h-5 w-5" />
            </button>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2Icon className="h-10 w-10" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Access Request Submitted! 🙌
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for your interest in Bent Planet. Our team will review your church&apos;s request and send a private onboarding link directly to <strong>{formData.email}</strong>.
                </p>
                <div className="pt-4">
                  <Button onClick={handleClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-2">
                    <SparklesIcon className="h-3.5 w-3.5" /> Invite-Only SaaS Platform
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-slate-900">
                    Request Church Workspace Access
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out your church details below. Our team verifies ministries before provisioning dedicated workspaces.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="churchName" className="text-xs font-semibold">Church Name *</Label>
                      <Input
                        id="churchName"
                        required
                        placeholder="e.g. Grace City Church"
                        value={formData.churchName}
                        onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="denomination" className="text-xs font-semibold">Denomination / Network</Label>
                      <select
                        id="denomination"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                        value={formData.denomination}
                        onChange={(e) => setFormData({ ...formData, denomination: e.target.value })}
                      >
                        <option value="Pentecostal">Pentecostal / Charismatic</option>
                        <option value="Baptist">Baptist</option>
                        <option value="Anglican / Episcopal">Anglican / Episcopal</option>
                        <option value="Methodist">Methodist</option>
                        <option value="Catholic">Catholic</option>
                        <option value="Non-denominational">Non-denominational</option>
                        <option value="Other">Other Christian Ministry</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="adminName" className="text-xs font-semibold">Lead Pastor / Admin Name *</Label>
                      <Input
                        id="adminName"
                        required
                        placeholder="e.g. Pastor David John"
                        value={formData.adminName}
                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold">Admin Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="pastor@gracecity.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold">WhatsApp / Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-xs font-semibold">Country & City</Label>
                      <Input
                        id="country"
                        placeholder="e.g. United States, Atlanta"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs font-semibold">Church Website or Social URL (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://gracecity.org or instagram link"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-semibold">How did you hear about Bent Planet?</Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      placeholder="Brief note or referral name..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-md text-xs mt-2"
                    disabled={loading}
                  >
                    <Building2Icon className="h-4 w-4" />
                    {loading ? "Submitting Request..." : "Submit Access Request"}
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
