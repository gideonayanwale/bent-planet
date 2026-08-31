"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendSystemAnnouncementAction } from "@/app/super-admin/actions";
import { SendIcon, XIcon, MegaphoneIcon, Loader2Icon } from "lucide-react";

export function BroadcastAnnouncementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setIsSending(true);

    const res = await sendSystemAnnouncementAction(title, message);
    setIsSending(false);
    if (res?.error) {
      alert(res.error);
    } else {
      onClose();
      setTitle("");
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
            <MegaphoneIcon className="h-5 w-5" />
            <h3>Broadcast to All Workspaces</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
            disabled={isSending}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-slate-500 mb-6">
          This will send an in-app notification to all active church workspaces on the platform.
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Announcement Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Platform Maintenance Notice"
              required
              className="text-xs"
              disabled={isSending}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Message Content</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the message here..."
              required
              rows={5}
              className="text-xs font-sans"
              disabled={isSending}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-md"
              disabled={isSending || !title || !message}
            >
              {isSending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
              {isSending ? "Sending..." : "Send Broadcast"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
