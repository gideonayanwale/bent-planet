"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { approveAccessRequestAction, rejectAccessRequestAction } from "@/app/super-admin/actions";
import { useDynamicTitle } from "@/lib/hooks";
import type { Database } from "@/types/database";

type AccessRequestRow = Database["public"]["Tables"]["access_requests"]["Row"];

export function AccessRequestsTable({ initialRequests }: { initialRequests: AccessRequestRow[] }) {
  const router = useRouter();
  const [requests, setRequests] = useState<AccessRequestRow[]>(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const tabTitles: Record<"all" | "pending" | "approved" | "rejected", string> = {
    all: "All Access Requests",
    pending: "Pending Access Requests",
    approved: "Approved Workspaces",
    rejected: "Rejected Requests",
  };

  useDynamicTitle(tabTitles[statusFilter], "Super Admin Portal");

  const handleApprove = async (req: AccessRequestRow) => {
    setLoadingId(req.id);
    try {
      const res = await approveAccessRequestAction(req.id);
      if (res.error) {
        alert(res.error);
      } else {
        setRequests(
          requests.map((r) => (r.id === req.id ? { ...r, status: "approved" } : r))
        );
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to approve request.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (req: AccessRequestRow) => {
    if (!confirm(`Reject request from ${req.church_name}?`)) return;
    setLoadingId(req.id);
    try {
      const res = await rejectAccessRequestAction(req.id);
      if (res.error) {
        alert(res.error);
      } else {
        setRequests(
          requests.map((r) => (r.id === req.id ? { ...r, status: "rejected" } : r))
        );
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to reject request.");
    } finally {
      setLoadingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
        {[
          { id: "all", label: `All (${requests.length})` },
          { id: "pending", label: `Pending (${pendingCount})` },
          { id: "approved", label: `Approved (${approvedCount})` },
          { id: "rejected", label: `Rejected (${rejectedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id as "all" | "pending" | "approved" | "rejected")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === tab.id
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs font-semibold">Church & Leader</TableHead>
              <TableHead className="text-xs font-semibold">Contact Details</TableHead>
              <TableHead className="text-xs font-semibold">Denomination & Country</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-right text-xs font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
              <TableRow key={req.id} className="hover:bg-slate-50/70 transition">
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">{req.church_name}</p>
                    <p className="text-[11px] text-slate-500">{req.admin_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-mono text-slate-700">{req.email}</p>
                    {req.phone && <p className="text-[11px] text-slate-400">{req.phone}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-medium text-slate-700">{req.denomination || "General"}</p>
                    <p className="text-[11px] text-slate-400">{req.country || "-"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {req.created_at
                    ? new Date(req.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Recent"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold ${
                      req.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : req.status === "rejected"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {req.status || "pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === "pending" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleApprove(req)}
                        disabled={loadingId === req.id}
                        className="h-7 text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      >
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Approve & Invite
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleReject(req)}
                        disabled={loadingId === req.id}
                        className="h-7 text-xs text-red-600 hover:bg-red-50"
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Resolved</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                No access requests submitted yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);
}
