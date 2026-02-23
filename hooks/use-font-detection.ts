"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/fingerprint-hash";
import { FONT_LIST } from "@/lib/font-list";
import type { FontDetection } from "@/types/fingerprint";

export function useFontDetection() {
  const [data, setData] = useState<FontDetection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        const baseFonts = ["monospace", "serif", "sans-serif"] as const;
        const testString = "mmmmmmmmmmlli";
        const testSize = "72px";

        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.left = "-9999px";
        span.style.top = "-9999px";
        span.style.fontSize = testSize;
        span.style.lineHeight = "normal";
        span.textContent = testString;
        document.body.appendChild(span);

        // Measure baseline widths for each base font
        const baselineWidths: Record<string, number> = {};
        for (const base of baseFonts) {
          span.style.fontFamily = base;
          baselineWidths[base] = span.offsetWidth;
        }

        const detected: string[] = [];

        for (const font of FONT_LIST) {
          let isDetected = false;
          for (const base of baseFonts) {
            span.style.fontFamily = `"${font}", ${base}`;
            if (span.offsetWidth !== baselineWidths[base]) {
              isDetected = true;
              break;
            }
          }
          if (isDetected) {
            detected.push(font);
          }
        }

        // Clean up
        document.body.removeChild(span);

        const sorted = detected.sort();
        const hash = await sha256(sorted.join(","));

        setData({
          tested: FONT_LIST.length,
          detected: sorted,
          hash,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to detect fonts");
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
