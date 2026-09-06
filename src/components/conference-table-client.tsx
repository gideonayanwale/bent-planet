"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveConferences } from "@/lib/hooks/use-live-conferences";
import {
  EditIcon,
  Trash2Icon,
  Share2Icon,
  ExternalLinkIcon,
  GlobeIcon,
  EyeOffIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Database } from "@/types/database";
import { deleteConferenceAction, toggleConferenceStatusAction } from "@/app/dashboard/conferences/[id]/actions";

type ConferenceRow = Database["public"]["Tables"]["conferences"]["Row"] & {
  subscribers?: { count: number }[];
};

interface ConferenceTableClientProps {
  conferences: ConferenceRow[];
  churchSlug: string;
  churchId?: string;
}

export function ConferenceTableClient({
  conferences,
  churchSlug,
  churchId,
}: ConferenceTableClientProps) {
  const router = useRouter();
  const [conferenceToDelete, setConferenceToDelete] = useState<ConferenceRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Auto-refresh conference list when a Realtime change arrives
  const handleConferenceChange = useCallback(() => {
    router.refresh();
  }, [router]);

  useLiveConferences(churchId ?? "", handleConferenceChange);

  const handleDelete = async () => {
    if (!conferenceToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteConferenceAction(conferenceToDelete.id);
      if (res.error) {
        alert(res.error);
      } else {
        setConferenceToDelete(null);
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to delete conference.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (conf: ConferenceRow) => {
    setUpdatingId(conf.id);
    const newStatus = conf.status === "published" ? "draft" : "published";
    try {
      const res = await toggleConferenceStatusAction(conf.id, newStatus);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!conferences || conferences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <p className="text-slate-500 text-sm">You haven&apos;t created any conferences yet.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/conferences/new">Create Your First Conference</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-semibold text-slate-700">Title & Details</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Subscribers</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conferences.map((conf) => {
              const isPublished = conf.status === "published";
              const isDraft = conf.status === "draft";
              const isUpdatingThis = updatingId === conf.id;

              return (
                <TableRow key={conf.id} className="hover:bg-slate-50/60 transition">
                  <TableCell>
                    <div className="space-y-0.5">
                      <Link
                        href={`/dashboard/conferences/${conf.id}/edit`}
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition"
                      >
                        {conf.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {conf.conference_date
                          ? new Date(conf.conference_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No date set"}
                        {conf.conference_time ? ` at ${conf.conference_time}` : ""}
                        {" · "}
                        <span className="font-medium text-slate-600">{conf.theme || "General"}</span>
                        {conf.speaker_name ? ` · ${conf.speaker_name}` : ""}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          isPublished
                            ? "bg-green-50 text-green-700 border-green-200 capitalize font-medium text-xs"
                            : isDraft
                            ? "bg-amber-50 text-amber-700 border-amber-200 capitalize font-medium text-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 capitalize font-medium text-xs"
                        }
                      >
                        {conf.status || "draft"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(conf)}
                        disabled={isUpdatingThis}
                        className="h-6 px-1.5 text-[11px] text-slate-500 hover:text-indigo-600"
                        title={isPublished ? "Switch to Draft" : "Publish Conference"}
                      >
                        {isPublished ? (
                          <EyeOffIcon className="h-3 w-3" />
                        ) : (
                          <GlobeIcon className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {conf.subscribers?.[0]?.count ?? 0}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Button */}
                      <Button asChild variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1">
                        <Link href={`/dashboard/conferences/${conf.id}/edit`}>
                          <EditIcon className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </Button>

                      {/* Promote Button */}
                      {isPublished && (
                        <Button asChild variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                          <Link href={`/dashboard/conferences/${conf.id}/promote`}>
                            <Share2Icon className="w-3.5 h-3.5" />
                            Promote
                          </Link>
                        </Button>
                      )}

                      {/* Public Live Link */}
                      {isPublished && (
                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Public Page">
                          <a
                            href={`/c/${churchSlug}/${conf.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon className="w-4 h-4 text-slate-500 hover:text-slate-900" />
                          </a>
                        </Button>
                      )}

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setConferenceToDelete(conf)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Conference"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      {conferenceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50">
                <Trash2Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Delete Conference?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 font-semibold">{conferenceToDelete.title}</strong>?
              This action will permanently delete this conference, public landing page, and associated links.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConferenceToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1.5"
              >
                <Trash2Icon className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
