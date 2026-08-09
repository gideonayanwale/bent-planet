"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SubscribeForm({ churchId, conferenceId }: { churchId: string, conferenceId: string }) {
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
      <div className="bg-green-50/50 border border-green-200 rounded-xl p-8 text-center space-y-3">
        <h3 className="text-xl font-semibold text-green-800">You&apos;re in! 🙌</h3>
        <p className="text-green-700">Check your email for the confirmation and details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          required 
          placeholder="e.g. Sarah Jenkins"
          value={formData.fullName}
          onChange={e => setFormData({...formData, fullName: e.target.value})}
          className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          required 
          placeholder="e.g. sarah@example.com"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="e.g. +1 234 567 8900"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
        />
      </div>
      <Button type="submit" size="lg" className="w-full text-lg shadow-lg hover:shadow-xl transition-all" disabled={loading}>
        {loading ? "Subscribing..." : "Secure My Spot"}
      </Button>
    </form>
  );
}
