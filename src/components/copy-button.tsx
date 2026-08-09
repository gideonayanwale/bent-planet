"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";

export function CopyButton({ textToCopy, className }: { textToCopy: string, className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCopy} 
      className={className}
    >
      {copied ? <CheckIcon className="w-4 h-4 mr-2 text-green-600" /> : <CopyIcon className="w-4 h-4 mr-2" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
