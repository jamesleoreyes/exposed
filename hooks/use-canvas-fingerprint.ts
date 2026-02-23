"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/fingerprint-hash";
import type { CanvasFingerprint } from "@/types/fingerprint";

export function useCanvasFingerprint() {
  const [data, setData] = useState<CanvasFingerprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 280;
        canvas.height = 60;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context not available");

        // Draw text
        ctx.font = "14px Arial";
        ctx.fillText("Exposed Fingerprint Test \uD83C\uDFA8", 2, 15);

        // Draw colored rectangle
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillRect(10, 25, 80, 30);

        // Draw arc with gradient
        const gradient = ctx.createLinearGradient(100, 25, 180, 55);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1, "red");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(140, 40, 15, 0, Math.PI * 2);
        ctx.fill();

        const dataUrl = canvas.toDataURL();
        const hash = await sha256(dataUrl);

        setData({ hash, dataUrl });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to collect canvas fingerprint");
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
