"use client";

import { useState, useEffect, useCallback } from "react";

export type NetworkTier = "high" | "low" | "unknown";

export interface NetworkQuality {
  /** Current assessed tier: "high" = stream video, "low" = canvas only */
  tier: NetworkTier;
  /** Whether the user has data saver / save-data enabled */
  saveData: boolean;
  /** Whether prefers-reduced-motion is active */
  prefersReducedMotion: boolean;
  /** Raw effective connection type if available */
  effectiveType: string | null;
  /** Estimated downlink speed in Mbps */
  downlink: number | null;
}

/**
 * Extends Navigator with the Network Information API (experimental).
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
interface NetworkInformation extends EventTarget {
  readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  readonly downlink: number;
  readonly saveData: boolean;
  readonly rtt: number;
  onchange: ((this: NetworkInformation, ev: Event) => void) | null;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

function getConnection(): NetworkInformation | null {
  if (typeof navigator === "undefined") return null;
  const nav = navigator as NavigatorWithConnection;
  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
}

function assessTier(
  conn: NetworkInformation | null,
  prefersReducedMotion: boolean
): NetworkTier {
  // If user prefers reduced motion, always go low
  if (prefersReducedMotion) return "low";

  if (!conn) return "unknown";

  // If data saver is on, stay low
  if (conn.saveData) return "low";

  // effectiveType must be 4g AND downlink must be decent (> 1.5 Mbps)
  if (conn.effectiveType === "4g" && conn.downlink >= 1.5) return "high";

  // 3g with very fast downlink could qualify
  if (conn.effectiveType === "3g" && conn.downlink >= 5) return "high";

  return "low";
}

export function useNetworkQuality(): NetworkQuality {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [quality, setQuality] = useState<NetworkQuality>({
    tier: "unknown",
    saveData: false,
    prefersReducedMotion: false,
    effectiveType: null,
    downlink: null,
  });

  const evaluate = useCallback(() => {
    const conn = getConnection();
    const motionQuery =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    setPrefersReducedMotion(motionQuery);

    setQuality({
      tier: assessTier(conn, motionQuery),
      saveData: conn?.saveData ?? false,
      prefersReducedMotion: motionQuery,
      effectiveType: conn?.effectiveType ?? null,
      downlink: conn?.downlink ?? null,
    });
  }, []);

  useEffect(() => {
    // Initial evaluation
    evaluate();

    // Listen for network changes
    const conn = getConnection();
    if (conn) {
      conn.addEventListener("change", evaluate);
    }

    // Listen for reduced-motion preference changes
    const motionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    motionMediaQuery.addEventListener("change", evaluate);

    return () => {
      if (conn) {
        conn.removeEventListener("change", evaluate);
      }
      motionMediaQuery.removeEventListener("change", evaluate);
    };
  }, [evaluate]);

  return quality;
}
