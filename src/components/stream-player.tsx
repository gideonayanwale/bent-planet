"use client";

import React, { useState, useEffect } from "react";
import { VideoIcon, ClockIcon, RadioIcon } from "lucide-react";

interface StreamPlayerProps {
  streamUrl?: string | null;
  conferenceDate?: string | null;
  conferenceTime?: string | null;
  enableReplay?: boolean | null;
}

export function StreamPlayer({
  streamUrl,
  conferenceDate,
  conferenceTime,
  enableReplay = true,
}: StreamPlayerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!conferenceDate) return;

    const timeStr = conferenceTime || "00:00";
    const targetDate = new Date(`${conferenceDate}T${timeStr}:00`);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Event time reached. Mark live for 4 hours, then ended.
        if (difference > -14400000) {
          setIsLive(true);
          setIsEnded(false);
        } else {
          setIsLive(false);
          setIsEnded(true);
        }
        setTimeLeft(null);
        return;
      }

      setIsLive(false);
      setIsEnded(false);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [conferenceDate, conferenceTime]);

  const [showEmbedOverride, setShowEmbedOverride] = useState(false);

  const getEmbedUrl = (url?: string | null, autoplay = true) => {
    if (!url) return null;

    // YouTube (handles normal video, live streams, scheduled premieres, shorts)
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|premiere)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      const ap = autoplay ? "1" : "0";
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${ap}&rel=0&modestbranding=1`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      const ap = autoplay ? "1" : "0";
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${ap}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(streamUrl, isLive);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-3 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 font-semibold text-red-500 animate-pulse">
              <RadioIcon className="h-4 w-4" />
              LIVE STREAMING NOW
            </span>
          ) : isEnded ? (
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <VideoIcon className="h-4 w-4" />
              {enableReplay ? "ON-DEMAND REPLAY" : "CONFERENCE ENDED"}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-indigo-400">
              <ClockIcon className="h-4 w-4" />
              UPCOMING EVENT
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isLive && !isEnded && embedUrl && (
            <button
              type="button"
              onClick={() => setShowEmbedOverride((prev) => !prev)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline transition-colors"
            >
              {showEmbedOverride ? "Show Countdown" : "Watch Premiere Waiting Room"}
            </button>
          )}

          {conferenceDate && (
            <div className="text-xs text-slate-400">
              {conferenceDate} {conferenceTime ? `at ${conferenceTime}` : ""}
            </div>
          )}
        </div>
      </div>

      {/* Main Video / Countdown Player Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
        {isLive || isEnded || !timeLeft || showEmbedOverride ? (
          embedUrl ? (
            <iframe
              src={embedUrl}
              title="Conference Stream"
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <VideoIcon className="h-16 w-16 mb-4 text-slate-600" />
              <p className="text-lg font-medium text-slate-200">Livestream Embed Available at Event Time</p>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Register below to receive an automated notification email as soon as the church goes live!
              </p>
            </div>
          )
        ) : (
          /* Countdown Viewport */
          <div className="flex flex-col items-center justify-center text-white p-6 text-center">
            <span className="px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-950/80 rounded-full border border-indigo-800">
              COUNTDOWN TO LIVESTREAM
            </span>
            <div className="grid grid-cols-4 gap-3 sm:gap-6 my-4">
              <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 min-w-[70px] sm:min-w-[90px]">
                <span className="text-3xl sm:text-5xl font-bold font-mono text-white">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-widest">Days</span>
              </div>
              <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 min-w-[70px] sm:min-w-[90px]">
                <span className="text-3xl sm:text-5xl font-bold font-mono text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-widest">Hours</span>
              </div>
              <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 min-w-[70px] sm:min-w-[90px]">
                <span className="text-3xl sm:text-5xl font-bold font-mono text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-widest">Mins</span>
              </div>
              <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 min-w-[70px] sm:min-w-[90px]">
                <span className="text-3xl sm:text-5xl font-bold font-mono text-indigo-400">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-widest">Secs</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Subscribe below to get direct stream links sent to your inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
