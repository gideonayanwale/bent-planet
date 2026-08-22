"use client";

import { useState, useRef } from "react";
import { UploadIcon, FileSpreadsheetIcon, CheckCircle2Icon, AlertTriangleIcon, XIcon, ArrowRightIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bulkImportSubscribersAction } from "@/app/dashboard/subscribers/actions";

interface ParsedSubscriber {
  fullName: string;
  email: string;
  phone?: string;
  status?: "valid" | "duplicate" | "invalid";
  conflictReason?: string;
}

export function CSVImporterModal({
  isOpen,
  onClose,
  conferenceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  conferenceId?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedSubscriber[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overwriteConflicts, setOverwriteConflicts] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; merged: number; failed: number } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = async (csvFile: File) => {
    const text = await csvFile.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return;

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
    const nameIdx = headers.findIndex((h) => h.includes("name") || h.includes("full"));
    const emailIdx = headers.findIndex((h) => h.includes("email") || h.includes("mail"));
    const phoneIdx = headers.findIndex((h) => h.includes("phone") || h.includes("mobile") || h.includes("whatsapp"));

    const records: ParsedSubscriber[] = [];
    const seenEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      const email = emailIdx !== -1 ? cols[emailIdx]?.toLowerCase() : "";
      const fullName = nameIdx !== -1 ? cols[nameIdx] : (email?.split("@")[0] || "Subscriber");
      const phone = phoneIdx !== -1 ? cols[phoneIdx] : undefined;

      if (!email || !email.includes("@")) {
        records.push({ fullName, email, phone, status: "invalid", conflictReason: "Invalid email format" });
      } else if (seenEmails.has(email)) {
        records.push({ fullName, email, phone, status: "duplicate", conflictReason: "Duplicate entry in CSV" });
      } else {
        seenEmails.add(email);
        records.push({ fullName, email, phone, status: "valid" });
      }
    }

    setParsedData(records);
  };

  const handleImport = async () => {
    const validRecords = parsedData.filter((r) => r.status === "valid" || (overwriteConflicts && r.status === "duplicate"));
    if (validRecords.length === 0) return;

    setIsProcessing(true);
    try {
      const res = await bulkImportSubscribersAction(
        validRecords.map((r) => ({
          fullName: r.fullName,
          email: r.email,
          phone: r.phone,
        })),
        overwriteConflicts
      );

      if (res.success) {
        setImportResult({ success: res.inserted || 0, merged: res.merged || 0, failed: res.failed || 0 });
      }
    } catch (err) {
      console.error("Bulk import failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FileSpreadsheetIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Import Subscribers from CSV / Excel</h3>
              <p className="text-xs text-slate-500">Auto-maps columns, checks duplicates, and reconciles conflicting records.</p>
            </div>
          </div>
          <Button variant="ghost" size="xs" onClick={onClose}>
            <XIcon className="h-4 w-4 text-slate-400" />
          </Button>
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer gap-3 text-center"
          >
            <input ref={fileInputRef} type="file" accept=".csv, .tsv, .txt" onChange={handleFileChange} className="hidden" />
            <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-full">
              <UploadIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Click to upload or drag & drop CSV file</p>
              <p className="text-xs text-slate-500 mt-1">Accepts UTF-8 CSV with Name, Email, and Phone columns</p>
            </div>
          </div>
        ) : importResult ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2Icon className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-lg">Import Completed Successfully!</h4>
            <div className="flex justify-center gap-4 text-xs font-semibold">
              <Badge variant="outline" className="bg-white text-emerald-700">{importResult.success} New Created</Badge>
              <Badge variant="outline" className="bg-white text-indigo-700">{importResult.merged} Records Reconciled</Badge>
              {importResult.failed > 0 && <Badge variant="destructive">{importResult.failed} Skipped</Badge>}
            </div>
            <Button onClick={onClose} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheetIcon className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-xs text-slate-800">{file.name}</p>
                  <p className="text-[11px] text-slate-500">{parsedData.length} Total Rows Detected</p>
                </div>
              </div>
              <Button variant="ghost" size="xs" onClick={() => { setFile(null); setParsedData([]); }}>
                <XIcon className="h-4 w-4 text-slate-400" />
              </Button>
            </div>

            {/* Preview List */}
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              {parsedData.slice(0, 15).map((row, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">{row.fullName}</span>
                    <span className="text-slate-500 font-mono ml-2">({row.email})</span>
                  </div>
                  {row.status === "valid" ? (
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 text-[10px]">Valid</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-700 bg-amber-50 text-[10px] gap-1">
                      <AlertTriangleIcon className="h-3 w-3" /> {row.conflictReason}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="overwriteConflicts"
                checked={overwriteConflicts}
                onChange={(e) => setOverwriteConflicts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="overwriteConflicts" className="text-xs text-slate-600 cursor-pointer">
                Overwrite existing phone/name data if newer information exists in CSV
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={onClose} disabled={isProcessing}>Cancel</Button>
              <Button size="sm" onClick={handleImport} disabled={isProcessing || parsedData.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-semibold">
                {isProcessing ? <RefreshCwIcon className="h-4 w-4 animate-spin" /> : <ArrowRightIcon className="h-4 w-4" />}
                {isProcessing ? "Importing..." : `Import ${parsedData.filter((r) => r.status === "valid").length} Subscribers`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
