"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2Icon, MegaphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BroadcastAnnouncementModal } from "./broadcast-announcement-modal";

export function SuperAdminHeaderActions() {
  const [showBroadcast, setShowBroadcast] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="text-indigo-600 font-bold text-xs border-indigo-200 hover:bg-indigo-50"
          onClick={() => setShowBroadcast(true)}
        >
          <MegaphoneIcon className="mr-1.5 h-4 w-4" />
          Broadcast to All Workspaces
        </Button>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
          <Link href="/super-admin/invite">
            <Building2Icon className="mr-1.5 h-4 w-4" />
            Invite Church Directly
          </Link>
        </Button>
      </div>

      <BroadcastAnnouncementModal
        isOpen={showBroadcast}
        onClose={() => setShowBroadcast(false)}
      />
    </>
  );
}
