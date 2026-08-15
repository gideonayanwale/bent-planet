"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SubscribeForm({ churchId, conferenceId }: { churchId: string; conferenceId?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, churchId, conferenceId }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
        <h3 className="text-lg font-bold text-emerald-900">You&apos;re connected! 🙌</h3>
        <p className="text-xs text-emerald-700">Thank you for subscribing. You will receive notifications for upcoming events.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">Full Name *</Label>
        <Input 
          id="fullName" 
          required 
          placeholder="e.g. Sarah Jenkins"
          value={formData.fullName}
          onChange={e => setFormData({...formData, fullName: e.target.value})}
          className="bg-white text-xs h-9"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address *</Label>
        <Input 
          id="email" 
          type="email" 
          required 
          placeholder="e.g. sarah@example.com"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="bg-white text-xs h-9"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Phone (Optional)</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="e.g. +1 234 567 8900"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          className="bg-white text-xs h-9"
        />
      </div>
      <Button type="submit" size="default" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md mt-2" disabled={loading}>
        {loading ? "Connecting..." : conferenceId ? "Reserve My Spot" : "Join Ministry Updates"}
      </Button>
    </form>
  );
}
