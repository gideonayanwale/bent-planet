"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject,
} from "react";
import { useNetworkQuality, type NetworkTier } from "@/hooks/use-network-quality";

// ─── Types ───────────────────────────────────────────────────
type BackgroundMode = "auto" | "video" | "canvas" | "paused";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

// ─── Procedural Cosmic Canvas Engine ─────────────────────────
function useProceduralCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  isActive: boolean
) {
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Size to viewport
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const w = window.innerWidth;
    const h = window.innerHeight;
    const particleCount = Math.min(Math.floor((w * h) / 8000), 120);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.6 + 0.15,
      pulseSpeed: Math.random() * 0.008 + 0.003,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Deep space gradient background
      const grad = ctx.createRadialGradient(
        vw * 0.5,
        vh * 0.35,
        0,
        vw * 0.5,
        vh * 0.5,
        vw * 0.9
      );
      grad.addColorStop(0, "#0c0a1e");
      grad.addColorStop(0.35, "#0a0819");
      grad.addColorStop(0.65, "#060510");
      grad.addColorStop(1, "#020108");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, vw, vh);

      // Gravitational nebula haze — slow rotating
      const nebulaAngle = t * 0.0004;
      const nebCX = vw * 0.5 + Math.cos(nebulaAngle) * vw * 0.08;
      const nebCY = vh * 0.38 + Math.sin(nebulaAngle * 0.7) * vh * 0.04;
      const nebula = ctx.createRadialGradient(
        nebCX,
        nebCY,
        0,
        nebCX,
        nebCY,
        vw * 0.45
      );
      nebula.addColorStop(0, "rgba(99,70,220,0.06)");
      nebula.addColorStop(0.3, "rgba(79,50,200,0.035)");
      nebula.addColorStop(0.6, "rgba(30,110,200,0.02)");
      nebula.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, vw, vh);

      // Secondary indigo haze
      const ind2CX = vw * 0.7 + Math.sin(nebulaAngle * 1.3) * vw * 0.05;
      const ind2CY = vh * 0.6 + Math.cos(nebulaAngle * 0.9) * vh * 0.05;
      const nebula2 = ctx.createRadialGradient(
        ind2CX,
        ind2CY,
        0,
        ind2CX,
        ind2CY,
        vw * 0.35
      );
      nebula2.addColorStop(0, "rgba(100,60,255,0.04)");
      nebula2.addColorStop(0.5, "rgba(50,100,220,0.02)");
      nebula2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, vw, vh);

      // Gravitational arc — the "bent light" signature
      ctx.save();
      ctx.beginPath();
      const arcCX = vw * 0.48;
      const arcCY = vh * 0.42;
      const arcRadius = Math.min(vw, vh) * 0.3;
      const arcStart = -0.15 + Math.sin(t * 0.001) * 0.1;
      const arcEnd = Math.PI * 0.75 + Math.cos(t * 0.0008) * 0.15;
      ctx.arc(arcCX, arcCY, arcRadius, arcStart, arcEnd);
      ctx.strokeStyle = `rgba(120,140,255,${0.06 + Math.sin(t * 0.005) * 0.02})`;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(100,120,255,0.15)";
      ctx.stroke();
      ctx.restore();

      // Second arc — orbital ring
      ctx.save();
      ctx.beginPath();
      const arc2Radius = arcRadius * 1.25;
      const arc2Start = Math.PI * 0.3 + Math.cos(t * 0.0006) * 0.2;
      const arc2End = Math.PI * 1.4 + Math.sin(t * 0.0007) * 0.15;
      ctx.arc(arcCX, arcCY, arc2Radius, arc2Start, arc2End);
      ctx.strokeStyle = `rgba(60,200,220,${0.035 + Math.sin(t * 0.004) * 0.015})`;
      ctx.lineWidth = 1.0;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(60,200,220,0.1)";
      ctx.stroke();
      ctx.restore();

      // Particles — celestial dust
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -5) p.x = vw + 5;
        if (p.x > vw + 5) p.x = -5;
        if (p.y < -5) p.y = vh + 5;
        if (p.y > vh + 5) p.y = -5;

        // Pulsing opacity
        const pulse =
          p.opacity * (0.7 + 0.3 * Math.sin(t * p.pulseSpeed + p.pulsePhase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,255,${pulse})`;
        ctx.fill();

        // Subtle glow for larger particles
        if (p.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,180,255,${pulse * 0.15})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, isActive]);
}

// ─── Video Streaming Subsystem ───────────────────────────────
function useVideoStreamer(
  videoRef: RefObject<HTMLVideoElement | null>,
  shouldStream: boolean
) {
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldStream) {
      setIsReady(false);
      return;
    }

    const onCanPlay = () => {
      setIsReady(true);
      setIsBuffering(false);
    };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onStalled = () => setIsBuffering(true);
    const onError = () => {
      setIsReady(false);
      setIsBuffering(false);
    };

    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("error", onError);

    // Begin loading
    video.load();

    return () => {
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("error", onError);
    };
  }, [videoRef, shouldStream]);

  return { isReady, isBuffering };
}

// ─── Mode Label ──────────────────────────────────────────────
function getModeLabel(mode: BackgroundMode, tier: NetworkTier, videoReady: boolean): string {
  if (mode === "paused") return "Paused";
  if (mode === "canvas") return "Eco Ambient";
  if (mode === "video" || (mode === "auto" && tier !== "low" && videoReady))
    return "HD Video";
  return "Eco Ambient";
}

function getModeIcon(mode: BackgroundMode, tier: NetworkTier, videoReady: boolean): string {
  const label = getModeLabel(mode, tier, videoReady);
  if (label === "HD Video") return "◉";
  if (label === "Eco Ambient") return "◎";
  return "◯";
}

// ─── Main Component ──────────────────────────────────────────
export function Hero3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const network = useNetworkQuality();

  const [mode, setMode] = useState<BackgroundMode>("auto");
  const [controlsOpen, setControlsOpen] = useState(false);

  // Determine if video should stream
  const shouldStreamVideo =
    mode === "video" ||
    (mode === "auto" && (network.tier === "high" || network.tier === "unknown") && !network.prefersReducedMotion);

  // Determine if canvas should be active
  const showCanvas = mode !== "paused";

  const { isReady: videoReady } = useVideoStreamer(videoRef, shouldStreamVideo);
  useProceduralCanvas(canvasRef, showCanvas);

  // Whether video layer is actively showing
  const showVideo = shouldStreamVideo && videoReady;

  const cycleMode = useCallback(() => {
    setMode((prev) => {
      if (prev === "auto") return "video";
      if (prev === "video") return "canvas";
      if (prev === "canvas") return "paused";
      return "auto";
    });
  }, []);

  return (
    <>
      {/* Layer 0: Procedural Canvas (always under video) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Layer 1: Video Stream (fades in when ready) */}
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          showVideo ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/bent-planet-poster.webp"
          className="w-full h-full object-cover"
        >
          <source
            src="/videos/bent-planet-3d-loop.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Layer 2: Cinematic readability masks */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        {/* Radial center-transparent vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(2,1,8,0.45) 55%, rgba(2,1,8,0.85) 100%)",
          }}
        />
        {/* Top dark gradient for navbar readability */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,1,8,0.7) 0%, transparent 100%)",
          }}
        />
        {/* Bottom dark gradient for footer/CTA readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(to top, rgba(2,1,8,0.8) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Layer 3: Ambient Mode Control Badge */}
      <div
        className="fixed bottom-5 right-5"
        style={{ zIndex: 60 }}
      >
        <button
          type="button"
          onClick={() => setControlsOpen(!controlsOpen)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest cursor-pointer select-none border transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "rgba(10,8,25,0.65)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(120,140,255,0.2)",
            color: "rgba(200,210,255,0.7)",
          }}
          aria-label="Toggle background mode"
        >
          <span className="text-xs">
            {getModeIcon(mode, network.tier, videoReady)}
          </span>
          <span>{getModeLabel(mode, network.tier, videoReady)}</span>
        </button>

        {controlsOpen && (
          <div
            className="absolute bottom-10 right-0 w-44 rounded-xl p-2 border space-y-1 animate-in fade-in zoom-in-95 duration-200"
            style={{
              background: "rgba(10,8,25,0.85)",
              backdropFilter: "blur(16px)",
              borderColor: "rgba(120,140,255,0.15)",
            }}
          >
            {(
              [
                { key: "auto", label: "Auto Detect", icon: "⟳" },
                { key: "video", label: "HD Video", icon: "◉" },
                { key: "canvas", label: "Eco Ambient", icon: "◎" },
                { key: "paused", label: "Paused", icon: "◯" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setMode(opt.key);
                  setControlsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  mode === opt.key
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}

            {/* Network info micro-line */}
            <div className="pt-1 px-3 text-[9px] font-mono text-slate-600 border-t border-white/5">
              {network.effectiveType
                ? `Net: ${network.effectiveType} · ${network.downlink}Mbps`
                : "Net: unknown"}
              {network.saveData && " · Data Saver"}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
