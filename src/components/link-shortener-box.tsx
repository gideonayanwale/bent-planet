"use "client"";

import { useState } from "react";
import { LinkIcon, SparklesIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { updateCustomAliasAction, generateBitlyUrlAction } from "@/app/dashboard/conferences/[id]/actions";

interface LinkShortenerBoxProps {
  conferenceId: string;
  baseUrl: string;
  churchSlug: string;
  conferenceSlug: string;
  initialShortUrl?: string | null;
  initialCustomAlias?: string | null;
}

export function LinkShortenerBox({
  conferenceId,
  baseUrl,
  churchSlug,
  conferenceSlug,
  initialShortUrl,
  initialCustomAlias,
}: LinkShortenerBoxProps) {
  const defaultLongUrl = `${baseUrl}/c/${churchSlug}/${conferenceSlug}`;
  
  const [customAlias, setCustomAlias] = useState(initialCustomAlias || "");
  const [shortUrl, setShortUrl] = useState(initialShortUrl || "");
  const [isSavingAlias, setIsSavingAlias] = useState(false);
  const [isGeneratingBitly, setIsGeneratingBitly] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const nativeCustomUrl = customAlias ? `${baseUrl}/${customAlias}` : null;

  const handleSaveAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAlias) return;
    setIsSavingAlias(true);
    setMessage(null);

    try {
      const res = await updateCustomAliasAction(conferenceId, customAlias);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else if (res.alias) {
        setCustomAlias(res.alias);
        setMessage({ type: "success", text: `Custom back-half URL active: ${baseUrl}/${res.alias}` });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ type: "error", text: error.message || "Failed to save custom alias." });
    } finally {
      setIsSavingAlias(false);
    }
  };

  const handleGenerateBitly = async () => {
    setIsGeneratingBitly(true);
    setMessage(null);

    try {
      const res = await generateBitlyUrlAction(conferenceId);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else if (res.shortUrl) {
        setShortUrl(res.shortUrl);
        setMessage({ type: "success", text: "Bitly shortened URL created successfully!" });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ type: "error", text: error.message || "Failed to generate Bitly URL." });
    } finally {
      setIsGeneratingBitly(false);
    }
  };

  return (
    <Card className="border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Shareable URL & Custom Back-Half</CardTitle>
            <CardDescription className="text-xs">
              Generate native custom URLs (e.g. {baseUrl}/AWOMANWITHLIVINGTESTIMONY) or request a Bitly short link on demand.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2Icon className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircleIcon className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. Native Custom Back-Half Generator */}
        <div className="space-y-2 p-4 rounded-xl border border-indigo-100 bg-white shadow-2xs">
          <label htmlFor="customAliasInput" className="text-xs font-bold text-slate-800 block">
            Custom Back-Half Link (No Bitly Needed)
          </label>
          <form onSubmit={handleSaveAlias} className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center flex-1 rounded-md border border-input bg-slate-50 px-3 py-1.5 text-xs text-slate-500 font-mono">
              <span className="shrink-0 text-slate-400 select-none">{baseUrl.replace(/^https?:\/\//, "")}/</span>
              <Input
                id="customAliasInput"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
                placeholder="AWOMANWITHLIVINGTESTIMONY"
                className="border-0 bg-transparent p-0 h-auto font-mono font-bold text-indigo-700 focus-visible:ring-0 text-xs"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0 text-xs gap-1.5"
              disabled={isSavingAlias}
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              {isSavingAlias ? "Saving..." : "Set Custom URL"}
            </Button>
          </form>
          {nativeCustomUrl && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-600">
                Active custom short link: <strong className="font-mono text-indigo-700">{nativeCustomUrl}</strong>
              </span>
              <CopyButton textToCopy={nativeCustomUrl} />
            </div>
          )}
        </div>

        {/* 2. On-Demand Bitly Link Shortening */}
        <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Bitly Short Link (On Demand)</span>
              <p className="text-[11px] text-slate-500">Shorten link via Bitly API upon request.</p>
            </div>
            {!shortUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateBitly}
                disabled={isGeneratingBitly}
                className="text-xs font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                {isGeneratingBitly ? "Shortening..." : "Generate Bitly Link"}
              </Button>
            )}
          </div>

          {shortUrl ? (
            <div className="flex items-center justify-between gap-3">
              <Input readOnly value={shortUrl} className="bg-slate-50 font-mono text-xs" />
              <CopyButton textToCopy={shortUrl} />
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No Bitly short link generated yet. Click above to shorten.</p>
          )}
        </div>

        {/* Default Long URL */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500">Standard Direct Page URL</span>
          <div className="flex gap-3">
            <Input readOnly value={defaultLongUrl} className="bg-slate-50 font-mono text-xs flex-1" />
            <CopyButton textToCopy={defaultLongUrl} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
