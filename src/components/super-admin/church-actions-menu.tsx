"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVerticalIcon,
  PlayIcon,
  BanIcon,
  CheckCircle2Icon,
  SlidersIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  startImpersonatingAction,
  updateChurchLimitsAction,
  updateChurchStatusAction,
} from "@/app/super-admin/actions";

interface ChurchActionsMenuProps {
  churchId: string;
  churchName: string;
  churchEmail: string;
  currentStatus: string;
  maxConferences: number;
  maxEmails: number;
}

export function ChurchActionsMenu({
  churchId,
  churchName,
  churchEmail,
  currentStatus,
  maxConferences,
  maxEmails,
}: ChurchActionsMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Limits inputs
  const [confLimit, setConfLimit] = useState(maxConferences);
  const [emailLimit, setEmailLimit] = useState(maxEmails);

  const handleImpersonate = async () => {
    setIsPending(true);
    const res = await startImpersonatingAction(churchEmail);
    if (res?.error) {
      alert(res.error);
      setIsPending(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleToggleStatus = async () => {
    setIsPending(true);
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    const res = await updateChurchStatusAction(churchId, nextStatus);
    if (res?.error) {
      alert(res.error);
    }
    setIsPending(false);
    setOpen(false);
  };

  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const res = await updateChurchLimitsAction(churchId, confLimit, emailLimit);
    if (res?.error) {
      alert(res.error);
    } else {
      setShowLimitsModal(false);
    }
    setIsPending(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="h-8 w-8 text-slate-500 hover:text-slate-700"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVerticalIcon className="h-4 w-4" />
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-52 z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-100">
            <button
              onClick={handleImpersonate}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              <PlayIcon className="h-3.5 w-3.5 text-indigo-600" />
              Impersonate Dashboard
            </button>

            <button
              onClick={() => setShowLimitsModal(true)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              <SlidersIcon className="h-3.5 w-3.5 text-amber-600" />
              Edit Limits
            </button>

            <div className="h-px bg-slate-100 my-1" />

            <button
              onClick={handleToggleStatus}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                currentStatus === "suspended"
                  ? "text-emerald-700 hover:bg-emerald-50"
                  : "text-rose-700 hover:bg-rose-50"
              }`}
            >
              {currentStatus === "suspended" ? (
                <>
                  <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600" />
                  Activate Workspace
                </>
              ) : (
                <>
                  <BanIcon className="h-3.5 w-3.5 text-rose-600" />
                  Suspend Workspace
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Limits Modal */}
      {showLimitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Workspace Limits for {churchName}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLimitsModal(false)}
                className="h-8 w-8 rounded-full"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveLimits} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="maxConferences" className="text-xs font-semibold">
                  Max Conferences / Events Limit
                </Label>
                <Input
                  id="maxConferences"
                  type="number"
                  value={confLimit}
                  onChange={(e) => setConfLimit(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxEmails" className="text-xs font-semibold">
                  Monthly Broadcast Email Limit
                </Label>
                <Input
                  id="maxEmails"
                  type="number"
                  value={emailLimit}
                  onChange={(e) => setEmailLimit(Number(e.target.value))}
                  min={0}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLimitsModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  disabled={isPending}
                >
                  Save Limits
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
