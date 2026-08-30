"use client";

import { useState } from "react";
import { MessageSquarePlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "@/components/feedback-form";

export function FeedbackModal({
  triggerText = "Feedback & Support",
  variant = "ghost",
  className = "",
}: {
  triggerText?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <MessageSquarePlusIcon className="h-3.5 w-3.5 mr-1.5" />
        {triggerText}
      </Button>

      {isOpen && (
        /* Full-screen backdrop overlay */
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Modal sheet card */}
          <div
            className="
              relative w-full sm:max-w-md
              bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
              border border-slate-200 dark:border-slate-800
              rounded-t-3xl sm:rounded-3xl
              shadow-2xl
              p-6 sm:p-8
              max-h-[92dvh] overflow-y-auto
              animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>

            {/* Drag handle for mobile devices */}
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="space-y-4">
              <div className="pr-6">
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-50">
                  Feedback & Support
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Have an issue, feature request, or general suggestion? Let us know below.
                </p>
              </div>

              <FeedbackForm onSuccess={() => {}} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
