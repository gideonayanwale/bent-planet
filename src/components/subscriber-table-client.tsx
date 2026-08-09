"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DownloadIcon, UserPlusIcon, SearchIcon, CheckIcon } from "lucide-react";

interface SubscriberItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  subscribed_at?: string | null;
  conferences?: { title?: string } | null;
}

interface SubscriberTableClientProps {
  initialSubscribers: SubscriberItem[];
  churchId: string;
}

export function SubscriberTableClient({
  initialSubscribers,
  churchId,
}: SubscriberTableClientProps) {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = subscribers.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = ["Full Name", "Email", "Phone", "Conference Source", "Subscribed Date"];
    const rows = subscribers.map((s) => [
      `"${s.full_name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${(s.phone || "").replace(/"/g, '""')}"`,
      `"${(s.conferences?.title || "Direct Signup").replace(/"/g, '""')}"`,
      `"${s.subscribed_at ? new Date(s.subscribed_at).toISOString() : ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          churchId,
          conferenceId: null,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (res.ok) {
        const newSub: SubscriberItem = {
          id: `manual-${Date.now()}`,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          subscribed_at: new Date().toISOString(),
          conferences: { title: "Manual Registration" },
        };
        setSubscribers([newSub, ...subscribers]);
        setForm({ fullName: "", email: "", phone: "" });
        setShowModal(false);
        setSuccessMsg("Subscriber added successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Failed to add subscriber:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckIcon className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search subscribers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Export CSV
          </Button>

          <Button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <UserPlusIcon className="w-4 h-4" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Conference Source</TableHead>
              <TableHead>Subscribed Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((sub) => (
                <TableRow key={sub.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-semibold text-slate-900">{sub.full_name}</TableCell>
                  <TableCell className="text-slate-600 font-mono text-xs">{sub.email}</TableCell>
                  <TableCell className="text-slate-600">{sub.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-700">
                      {sub.conferences?.title || "Direct Signup"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {sub.subscribed_at
                      ? new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                  {search ? "No subscribers match your search." : "No subscribers yet. Share your conference link to grow your list!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Manual Add Subscriber Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading text-slate-900">Add New Subscriber</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Full Name</label>
                <Input
                  required
                  placeholder="e.g. John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Phone (Optional)</label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  {isSubmitting ? "Saving..." : "Add Subscriber"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
