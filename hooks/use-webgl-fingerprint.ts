"use client";

import { useState, useEffect } from "react";
import { sha256 } from "@/lib/fingerprint-hash";
import type { WebGLFingerprint } from "@/types/fingerprint";

export function useWebGLFingerprint() {
  const [data, setData] = useState<WebGLFingerprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function collect() {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl || !(gl instanceof WebGLRenderingContext)) {
          throw new Error("WebGL not available");
        }

        let vendor: string | null = null;
        let renderer: string | null = null;

        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        if (ext) {
          vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) ?? null;
          renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? null;
        }

        const version: string | null = gl.getParameter(gl.VERSION) ?? null;
        const shadingLanguageVersion: string | null =
          gl.getParameter(gl.SHADING_LANGUAGE_VERSION) ?? null;
        const extensions: string[] = gl.getSupportedExtensions() ?? [];
        const maxTextureSize: number | null = gl.getParameter(gl.MAX_TEXTURE_SIZE) ?? null;
        const maxRenderBufferSize: number | null =
          gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) ?? null;

        const combined = [
          vendor,
          renderer,
          version,
          shadingLanguageVersion,
          extensions.join(","),
          maxTextureSize,
          maxRenderBufferSize,
        ].join("|");

        const hash = await sha256(combined);

        setData({
          vendor,
          renderer,
          version,
          shadingLanguageVersion,
          extensions,
          maxTextureSize,
          maxRenderBufferSize,
          hash,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to collect WebGL fingerprint");
      } finally {
        setLoading(false);
      }
    }

    collect();
  }, []);

  return { data, loading, error };
}
