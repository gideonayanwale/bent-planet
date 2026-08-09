"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, LayoutGridIcon, SmartphoneIcon } from "lucide-react";

interface PosterGeneratorProps {
  churchName: string;
  title: string;
  speaker?: string | null;
  date?: string | null;
  time?: string | null;
  theme?: string | null;
  bannerUrl?: string | null;
}

export function PosterGenerator({
  churchName,
  title,
  speaker,
  date,
  time,
  theme,
  bannerUrl,
}: PosterGeneratorProps) {
  const [format, setFormat] = useState<"square" | "story">("square");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isSquare = format === "square";
  const canvasWidth = isSquare ? 1080 : 1080;
  const canvasHeight = isSquare ? 1080 : 1920;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background
    const bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    bgGradient.addColorStop(0, "#0f172a");
    bgGradient.addColorStop(0.5, "#1e1b4b");
    bgGradient.addColorStop(1, "#020617");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Decorative circle glow
    const radial = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 3,
      50,
      canvasWidth / 2,
      canvasHeight / 3,
      500
    );
    radial.addColorStop(0, "rgba(99, 102, 241, 0.35)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const renderTextContent = () => {
      // Overlay gradient for contrast
      const overlayGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      overlayGrad.addColorStop(0, "rgba(15, 23, 42, 0.4)");
      overlayGrad.addColorStop(0.6, "rgba(15, 23, 42, 0.8)");
      overlayGrad.addColorStop(1, "rgba(2, 6, 23, 0.95)");
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Top theme badge
      const badgeText = (theme || "SPECIAL CONFERENCE").toUpperCase();
      ctx.font = "bold 28px sans-serif";
      const badgeMetrics = ctx.measureText(badgeText);
      const badgeWidth = badgeMetrics.width + 40;
      const badgeX = (canvasWidth - badgeWidth) / 2;
      const badgeY = isSquare ? 120 : 200;

      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, 54, 27);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#a5b4fc";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(badgeText, canvasWidth / 2, badgeY + 27);

      // Church name
      ctx.font = "600 36px sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(churchName.toUpperCase(), canvasWidth / 2, badgeY + 110);

      // Conference Title (Wrapped)
      ctx.font = "bold 72px sans-serif";
      ctx.fillStyle = "#ffffff";
      const words = title.split(" ");
      let line = "";
      let lines: string[] = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvasWidth - 160 && n > 0) {
          lines.push(line.trim());
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      const startY = isSquare ? 460 : 750;
      const lineHeight = 86;
      lines.forEach((l, idx) => {
        ctx.fillText(l, canvasWidth / 2, startY + idx * lineHeight);
      });

      // Speaker
      if (speaker) {
        const speakerY = startY + lines.length * lineHeight + 40;
        ctx.font = "600 42px sans-serif";
        ctx.fillStyle = "#818cf8";
        ctx.fillText(`Speaker: ${speaker}`, canvasWidth / 2, speakerY);
      }

      // Date & Time Box
      const dateY = isSquare ? 880 : 1550;
      ctx.font = "600 38px sans-serif";
      ctx.fillStyle = "#e2e8f0";
      const dateStr = [date, time].filter(Boolean).join(" • ");
      ctx.fillText(dateStr || "Register Free Online", canvasWidth / 2, dateY);

      // Footer branding
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("POWERED BY BENT PLANET", canvasWidth / 2, canvasHeight - 60);
    };

    if (bannerUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = bannerUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        renderTextContent();
      };
      img.onerror = () => {
        renderTextContent();
      };
    } else {
      renderTextContent();
    }
  }, [canvasWidth, canvasHeight, churchName, title, speaker, date, time, theme, bannerUrl, isSquare]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-poster-${format}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-xl">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={format === "square" ? "default" : "outline"}
            onClick={() => setFormat("square")}
            className="flex items-center gap-2"
          >
            <LayoutGridIcon className="w-4 h-4" />
            Square (1080×1080)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={format === "story" ? "default" : "outline"}
            onClick={() => setFormat("story")}
            className="flex items-center gap-2"
          >
            <SmartphoneIcon className="w-4 h-4" />
            Story (1080×1920)
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleDownload}
          className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <DownloadIcon className="w-4 h-4" />
          Download Poster PNG
        </Button>
      </div>

      <div className="flex justify-center bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="max-h-[550px] w-auto rounded-lg shadow-lg object-contain"
        />
      </div>
    </div>
  );
}
