"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BellIcon, CheckCheckIcon, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiveNotifications } from "@/lib/hooks/use-live-notifications";
function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return options?.addSuffix ? "just now" : "less than a minute";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return options?.addSuffix ? `${diffInMinutes}m ago` : `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return options?.addSuffix ? `${diffInHours}h ago` : `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return options?.addSuffix ? `${diffInDays}d ago` : `${diffInDays}d`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return options?.addSuffix ? `${diffInMonths}mo ago` : `${diffInMonths}mo`;
  const diffInYears = Math.floor(diffInDays / 365);
  return options?.addSuffix ? `${diffInYears}y ago` : `${diffInYears}y`;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url?: string;
  read: boolean;
  created_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  request: "bg-blue-100 text-blue-700",
  announcement: "bg-indigo-100 text-indigo-700",
  error: "bg-red-100 text-red-700",
  violation: "bg-orange-100 text-orange-700",
  delete: "bg-rose-100 text-rose-700",
  system: "bg-gray-100 text-gray-600",
};

export function NotificationBell({ churchId }: { churchId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Live Realtime subscription: prepend new notifications as they arrive
  const handleLiveNotification = useCallback(
    (record: {
      id: string;
      church_id: string | null;
      type: string;
      title: string;
      message: string;
      action_url: string | null;
      read: boolean | null;
      created_at: string | null;
    }) => {
      setNotifications((prev) => {
        // Deduplicate — avoid adding if we already have this ID
        if (prev.some((n) => n.id === record.id)) return prev;
        const mapped: Notification = {
          id: record.id,
          type: record.type,
          title: record.title,
          message: record.message,
          action_url: record.action_url ?? undefined,
          read: Boolean(record.read),
          created_at: record.created_at ?? new Date().toISOString(),
        };
        return [mapped, ...prev];
      });
    },
    [],
  );

  useLiveNotifications(churchId ?? "", handleLiveNotification);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (!unreadIds.length) return;

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // fail silently
    }
  }

  // Open + fetch
  function handleOpen() {
    setOpen((o) => !o);
    if (!open) {
      fetchNotifications();
    }
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch on mount for badge count
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground"
        onClick={handleOpen}
        aria-label="Notifications"
      >
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[400px] z-50 rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <h4 className="text-sm font-bold text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary hover:text-primary/80 gap-1 h-7 px-2"
                onClick={markAllRead}
              >
                <CheckCheckIcon className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border/50">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <LoaderIcon className="animate-spin h-5 w-5 text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                <BellIcon className="h-7 w-7 opacity-40" />
                <p className="text-xs font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-default ${
                    !n.read ? "bg-primary/5 dark:bg-primary/10" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${TYPE_COLORS[n.type] || TYPE_COLORS.system}`}>
                      {n.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{n.message}</p>
                    {n.action_url && (
                      <a
                        href={n.action_url}
                        className="text-[11px] text-primary font-medium hover:underline mt-0.5 block"
                      >
                        View →
                      </a>
                    )}
                    <p className="text-[10px] text-muted-foreground/75 mt-1 font-mono">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="shrink-0 mt-1.5">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-border bg-muted/40 text-center">
              <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                Showing last {notifications.length} notifications
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
