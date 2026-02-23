"use client";

import { useState, useEffect } from "react";
import type { HardwareInfo } from "@/types/fingerprint";

export function useHardwareInfo() {
  const [data, setData] = useState<HardwareInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      let gpuVendor: string | null = null;
      let gpuRenderer: string | null = null;

      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl && gl instanceof WebGLRenderingContext) {
          const ext = gl.getExtension("WEBGL_debug_renderer_info");
          if (ext) {
            gpuVendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) ?? null;
            gpuRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? null;
          }
        }
      } catch {
        // GPU detection not available
      }

      setData({
        cpuCores: navigator.hardwareConcurrency,
        deviceMemory: "deviceMemory" in navigator ? (navigator as Navigator & { deviceMemory: number }).deviceMemory : null,
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        maxTouchPoints: navigator.maxTouchPoints,
        gpuVendor,
        gpuRenderer,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to collect hardware info");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
