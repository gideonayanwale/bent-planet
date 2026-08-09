"use client";

import { useState } from "react";
import { Share2Icon, CopyIcon, CheckIcon, QrCodeIcon, MessageSquareIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
  title: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ title, url, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsapp = () => {
    const text = encodeURIComponent(`Join us live for ${title} on Bent Planet!\n${fullUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, "_blank");
  };

  // Simple clean SVG QR code fallback representation
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Share2Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Share Conference</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Link Copy Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Shareable URL</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pl-3">
            <span className="text-xs font-mono text-slate-600 truncate flex-1">{fullUrl}</span>
            <Button size="sm" onClick={handleCopy} className="gap-1.5 h-8 text-xs font-medium">
              {copied ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareWhatsapp}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
          >
            <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
            WhatsApp Share
          </button>
          <button
            onClick={shareFacebook}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition"
          >
            <ExternalLinkIcon className="h-4 w-4 text-blue-600" />
            Facebook Post
          </button>
        </div>

        {/* QR Code Section */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
          >
            <span className="flex items-center gap-2">
              <QrCodeIcon className="h-4 w-4 text-indigo-500" />
              Event QR Code (For Printed Flyers & Bulletins)
            </span>
            <span className="text-indigo-600">{showQr ? "Hide" : "Show QR"}</span>
          </button>

          {showQr && (
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3 animate-in zoom-in-95 duration-150">
              <img src={qrApiUrl} alt="Conference QR Code" className="h-40 w-40 rounded-lg shadow-sm border border-white" />
              <p className="text-[11px] text-slate-500 text-center">Attendees can scan this QR code with their mobile cameras to open the live conference page directly.</p>
              <a
                href={qrApiUrl}
                download="conference-qr.png"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Download PNG Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
