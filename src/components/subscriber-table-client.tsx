"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DownloadIcon,
  UploadIcon,
  UserPlusIcon,
  SearchIcon,
  CheckIcon,
  Trash2Icon,
  XIcon,
  FileSpreadsheetIcon,
  AlertCircleIcon,
} from "lucide-react";
import {
  bulkImportSubscribersAction,
  deleteSubscriberAction,
  type BulkImportItem,
} from "@/app/dashboard/subscribers/actions";

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
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: "", email: "", phone: "" });
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CSV Import State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [parsedCsvItems, setParsedCsvItems] = useState<BulkImportItem[]>([]);
  const [importing, setImporting] = useState(false);

  const filtered = subscribers.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.includes(search))
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

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setFeedback({ type: "error", text: "CSV file must contain a header and at least one row." });
        return;
      }

      // Simple header inspection
      const headerLine = lines[0].toLowerCase();
      const headers = headerLine.split(",").map((h) => h.replace(/["']/g, "").trim());

      let nameIdx = headers.findIndex((h) => h.includes("name"));
      let emailIdx = headers.findIndex((h) => h.includes("email") || h.includes("mail"));
      let phoneIdx = headers.findIndex((h) => h.includes("phone") || h.includes("tel") || h.includes("mobile") || h.includes("whatsapp"));

      if (nameIdx === -1) nameIdx = 0;
      if (emailIdx === -1) emailIdx = 1;
      if (phoneIdx === -1) phoneIdx = 2;

      const items: BulkImportItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((c) => c.replace(/^["']|["']$/g, "").trim());
        const email = row[emailIdx];
        if (email && email.includes("@")) {
          items.push({
            fullName: row[nameIdx] || "Member",
            email,
            phone: row[phoneIdx] || undefined,
          });
        }
      }

      setParsedCsvItems(items);
    };

    reader.readAsText(file);
  };

  const handleExecuteBulkImport = async () => {
    if (parsedCsvItems.length === 0) return;
    setImporting(true);
    try {
      const res = await bulkImportSubscribersAction(parsedCsvItems);
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setFeedback({ type: "success", text: `Successfully imported and deduplicated ${res.count} subscribers!` });
        setShowImportModal(false);
        setParsedCsvItems([]);
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setFeedback({ type: "error", text: error.message || "Failed to import subscribers." });
    } finally {
      setImporting(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.fullName || !addForm.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          churchId,
          conferenceId: null,
          fullName: addForm.fullName,
          email: addForm.email,
          phone: addForm.phone,
        }),
      });

      if (res.ok) {
        const newSub: SubscriberItem = {
          id: `manual-${Date.now()}`,
          full_name: addForm.fullName,
          email: addForm.email,
          phone: addForm.phone,
          subscribed_at: new Date().toISOString(),
          conferences: { title: "Direct Registration" },
        };
        setSubscribers([newSub, ...subscribers]);
        setAddForm({ fullName: "", email: "", phone: "" });
        setShowAddModal(false);
        setFeedback({ type: "success", text: "Subscriber added successfully!" });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error("Failed to add subscriber:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscriber = async (sub: SubscriberItem) => {
    if (!confirm(`Are you sure you want to remove ${sub.full_name} (${sub.email})?`)) return;
    try {
      const res = await deleteSubscriberAction(sub.id);
      if (res.error) {
        alert(res.error);
      } else {
        setSubscribers(subscribers.filter((s) => s.id !== sub.id));
        setFeedback({ type: "success", text: "Subscriber removed." });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to delete subscriber.");
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckIcon className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircleIcon className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="gap-1.5 text-xs bg-white"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          {/* Import CSV */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowImportModal(true)}
            className="gap-1.5 text-xs bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          >
            <UploadIcon className="h-3.5 w-3.5" />
            Import CSV List
          </Button>

          {/* Manual Add Subscriber */}
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <UserPlusIcon className="h-3.5 w-3.5" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-semibold text-xs text-slate-700">Subscriber</TableHead>
              <TableHead className="font-semibold text-xs text-slate-700">Contact</TableHead>
              <TableHead className="font-semibold text-xs text-slate-700">Event Source</TableHead>
              <TableHead className="font-semibold text-xs text-slate-700">Date Joined</TableHead>
              <TableHead className="text-right font-semibold text-xs text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((sub) => (
                <TableRow key={sub.id} className="hover:bg-slate-50/60 transition">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 text-xs">
                        {sub.full_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-xs text-slate-900">{sub.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
                      <p className="font-mono text-slate-700">{sub.email}</p>
                      {sub.phone && <p className="text-[11px] text-slate-400">{sub.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px] bg-slate-50 border-slate-200">
                      {sub.conferences?.title || "Ministry Hub Signup"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {sub.subscribed_at
                      ? new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubscriber(sub)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Remove Subscriber"
                    >
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500 text-xs">
                  No subscribers found. Import a CSV or share your conference landing pages to start growing your audience.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Manual Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900">Add New Subscriber</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="addFullName" className="text-xs">Full Name *</Label>
                <Input
                  id="addFullName"
                  required
                  placeholder="e.g. Min. Sarah Jenkins"
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addEmail" className="text-xs">Email Address *</Label>
                <Input
                  id="addEmail"
                  type="email"
                  required
                  placeholder="e.g. sarah@example.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addPhone" className="text-xs">Phone / WhatsApp (Optional)</Label>
                <Input
                  id="addPhone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add to Roster"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal with Smart Deduplication */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileSpreadsheetIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Import Subscribers from CSV</h3>
                  <p className="text-xs text-slate-500">Upload a spreadsheet list with smart deduplication.</p>
                </div>
              </div>
              <button onClick={() => { setShowImportModal(false); setParsedCsvItems([]); }} className="text-slate-400 hover:text-slate-600">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {parsedCsvItems.length === 0 ? (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-2xl p-8 text-center cursor-pointer transition space-y-3"
                >
                  <UploadIcon className="h-8 w-8 text-indigo-600 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Click to upload CSV file</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Supports standard CSV with Name, Email, and Phone columns.</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl text-xs text-indigo-900 font-semibold">
                  <span>Found {parsedCsvItems.length} records in CSV</span>
                  <Button variant="ghost" size="xs" onClick={() => setParsedCsvItems([])} className="text-xs text-indigo-700 hover:bg-indigo-100">
                    Upload different file
                  </Button>
                </div>

                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Email</TableHead>
                        <TableHead className="text-xs">Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedCsvItems.slice(0, 10).map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-medium">{item.fullName}</TableCell>
                          <TableCell className="text-xs font-mono">{item.email}</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.phone || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {parsedCsvItems.length > 10 && (
                  <p className="text-[11px] text-slate-500 text-center">+ {parsedCsvItems.length - 10} more records ready for import.</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setShowImportModal(false); setParsedCsvItems([]); }} className="text-xs">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleExecuteBulkImport}
                    disabled={importing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5"
                  >
                    <CheckIcon className="h-4 w-4" />
                    {importing ? "Importing & Deduplicating..." : `Import ${parsedCsvItems.length} Subscribers`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
