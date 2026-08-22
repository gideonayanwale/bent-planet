"use client";

import { useState } from "react";
import { SparklesIcon, CheckCircle2Icon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PublicFooter } from "@/components/public-footer";

export default function RequestAccessPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    churchName: "",
    adminName: "",
    email: "",
    phone: "",
    website: "",
    denomination: "Pentecostal",
    country: "Nigeria",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-xl border-slate-200/80 bg-white shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">
              <SparklesIcon className="h-4 w-4" /> Partner with Bent Planet
            </div>
            <CardTitle className="text-2xl font-bold font-heading">Request Church Workspace Access</CardTitle>
            <CardDescription className="text-slate-300 text-xs mt-1">
              Complete this application to join the Bent Planet platform. Our team will review your ministry details and issue a verified invite link.
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2Icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for applying. We have received your request for <strong className="text-slate-900">{formData.churchName}</strong>. Our super-admin will review and dispatch your invitation to <span className="font-mono text-slate-900">{formData.email}</span> shortly.
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Church / Ministry Name *</label>
                    <Input required placeholder="Living Word Center" value={formData.churchName} onChange={(e) => setFormData({ ...formData, churchName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Denomination / Affiliation</label>
                    <Input placeholder="e.g. Baptist, Pentecostal" value={formData.denomination} onChange={(e) => setFormData({ ...formData, denomination: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Lead Admin / Coordinator Name *</label>
                    <Input required placeholder="Pastor John Doe" value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Admin Email Address *</label>
                    <Input type="email" required placeholder="pastor@church.org" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Phone / WhatsApp Number *</label>
                    <Input required placeholder="+234 800 000 0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Website URL (Optional)</label>
                    <Input placeholder="https://mychurch.org" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Ministry Overview & Events Plan</label>
                  <Textarea placeholder="Tell us briefly about your weekly programs and conferences..." rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2">
                  {isSubmitting ? "Submitting Application..." : "Submit Access Request"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
